import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { env } from "@/env";
import type { StripePlan } from "@/types";
import type { PrismaClient } from "@prisma/client";
import { getLocale } from "next-intl/server";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

const isSubscriptionUpdateAllowed = async (
  tenantId: string,
  priceId: string,
  prisma: PrismaClient,
  throwError = true,
) => {
  await prisma.tenant.findUniqueOrThrow({
    where: {
      id: tenantId,
    },
  });

  const activeUsers = await prisma.user.count({
    where: {
      tenantId,
      deletedAt: null,
    },
  });

  const activeInvitations = await prisma.invitation.count({
    where: {
      invitedBy: { tenantId },
      expires: { gt: DateTime.now().toJSDate() },
    },
  });

  const plan = await prisma.plan.findUniqueOrThrow({
    where: {
      stripePriceId: priceId,
    },
  });

  if (activeUsers + activeInvitations > plan.maxUsers) {
    if (throwError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Downgrade not allowed - new plan does not support this many users",
      });
    }

    return false;
  }

  return true;
};

export const stripeRouter = createTRPCRouter({
  products: protectedProcedure.query(async () => {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const products = await stripe.products.list();

    const prices = await stripe.prices.list();

    return products.data.map((product) => ({
      ...product,
      price: prices.data.find((price) => price.product === product.id),
    }));
  }),

  plans: protectedProcedure.query(async () => {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const plans = (
      await stripe.plans.list({
        expand: [
          "data.product.marketing_features",
          "data.product.default_price",
        ],
      })
    ).data as unknown as StripePlan[];

    return plans
      .sort((a, b) => {
        const priceA = a.product.default_price?.unit_amount ?? 0;
        const priceB = b.product.default_price?.unit_amount ?? 0;
        return priceA - priceB;
      })
      .map((plan) => plan as unknown as StripePlan);
  }),

  subscription: adminProcedure.query(async ({ ctx }) => {
    const tenantId = ctx.session.user.tenantId;

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const tenant = await ctx.db.tenant.findUniqueOrThrow({
      where: {
        id: tenantId,
      },
      include: {
        profile: true,
      },
    });

    const subscription = await stripe.subscriptions.retrieve(
      tenant.profile.stripeSubscriptionId,
    );

    if (!subscription.items.data[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Subscription item not found",
      });
    }

    const plan = await ctx.db.plan.findUniqueOrThrow({
      where: {
        stripePriceId: subscription.items.data[0].price.id,
      },
    });

    return {
      plan,
      subscription,
    };
  }),

  checkout: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        size: z.string().optional(),
        avatarId: z.string().nullable(),
        planId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { avatarId, ...input } }) => {
      const email = ctx.session.email;
      const locale: "ro" | "en" = (await getLocale()) as "ro" | "en";

      const profile = await ctx.db.profile.findUniqueOrThrow({
        where: {
          email,
        },
      });

      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
      });

      const userId = uuidv4();

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: input.planId,
            quantity: 1,
          },
        ],
        client_reference_id: userId,
        success_url: `${env.URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.URL}/create-clinic`,
        allow_promotion_codes: true,
        billing_address_collection: "required",
        tax_id_collection: {
          enabled: true,
        },
        locale: locale ?? "en",
        subscription_data: {
          trial_period_days: profile.stripeFreeTrialUsed ? undefined : 14,
          metadata: {
            ...input,
            email,
            avatarId,
            userId,
          },
        },
      });

      if (!checkoutSession.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create checkout session",
        });
      }

      return {
        redirectUrl: checkoutSession.url,
      };
    }),

  updateSubscription: adminProcedure
    .input(
      z.object({
        priceId: z.string(),
        prorationDate: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = ctx.session.user.tenantId;
      const userId = ctx.session.user.id;
      const { priceId, prorationDate } = input;

      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
        typescript: true,
      });

      const plan = await ctx.db.plan.findUniqueOrThrow({
        where: {
          stripePriceId: priceId,
        },
      });

      const stripePlan = await stripe.plans.retrieve(priceId);

      if (!plan || !stripePlan) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Plan not found",
        });
      }

      const tenant = await ctx.db.tenant.findFirst({
        where: {
          id: tenantId,
        },
        include: {
          profile: true,
        },
      });

      if (!tenant) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tenant not found",
        });
      }

      const subscription = await stripe.subscriptions.retrieve(
        tenant.profile.stripeSubscriptionId,
      );

      if (!subscription || subscription.status === "canceled") {
        const checkoutSession = await stripe.checkout.sessions.create({
          mode: "subscription",
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          client_reference_id: userId,
          success_url: `${env.URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.URL}/create-clinic`,
          allow_promotion_codes: true,
          billing_address_collection: "required",
          tax_id_collection: {
            enabled: true,
          },
          subscription_data: {
            metadata: {
              planId: priceId,
              userId,
            },
          },
        });

        if (!checkoutSession.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create checkout session",
          });
        }

        return {
          redirectUrl: checkoutSession.url,
        };
      }

      if (!subscription.items.data[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription item not found",
        });
      }

      const oldPrice = subscription.items.data[0].price.unit_amount;
      const newPrice = stripePlan.amount;

      if (!oldPrice || !newPrice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Price not found",
        });
      }

      const opperationType: "upgrade" | "downgrade" =
        oldPrice > newPrice ? "downgrade" : "upgrade";

      await isSubscriptionUpdateAllowed(
        tenantId,
        priceId,
        ctx.db as unknown as PrismaClient,
      );
      if (opperationType === "downgrade") {
        await stripe.subscriptions.update(subscription.id, {
          items: [
            {
              id: subscription.items.data[0].id,
              price: priceId,
            },
          ],
        });
      } else {
        const proration_date = prorationDate ?? Math.floor(Date.now() / 1000);
        const items = [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ];

        await stripe.subscriptions.update(subscription.id, {
          items,
          proration_date,
        });
      }

      return;
    }),

  previewUpdate: adminProcedure
    .input(
      z.object({
        priceId: z.string(),
        prorationDate: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tenantId = ctx.session.user.tenantId;
      const { priceId, prorationDate } = input;

      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
      });

      const stripePlan = await stripe.plans.retrieve(priceId);

      if (!stripePlan) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Plan not found",
        });
      }

      const tenant = await ctx.db.tenant.findUniqueOrThrow({
        where: {
          id: tenantId,
        },
        include: {
          profile: true,
        },
      });

      const subscription = await stripe.subscriptions.retrieve(
        tenant.profile.stripeSubscriptionId,
      );

      if (!subscription.items.data[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription item not found",
        });
      }

      const oldPrice = subscription.items.data[0].price.unit_amount;
      const newPrice = stripePlan.amount;

      if (!oldPrice || !newPrice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Price not found",
        });
      }

      const opperationType: "upgrade" | "downgrade" =
        oldPrice > newPrice ? "downgrade" : "upgrade";

      const isAllowed = await isSubscriptionUpdateAllowed(
        tenantId,
        priceId,
        ctx.db as unknown as PrismaClient,
        false,
      );

      const items = [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ];

      if (!prorationDate) {
        return {
          isAllowed,
        };
      }

      try {
        const invoice = await stripe.invoices.retrieveUpcoming({
          subscription: tenant.profile.stripeSubscriptionId,
          subscription_items: items,
          subscription_proration_date: prorationDate,
        });
        return {
          isAllowed,
          proration:
            opperationType === "upgrade" ? invoice.lines.data : undefined,
        };
      } catch (_err) {
        console.log("No upcoming invoice");
        return {
          isAllowed,
        };
      }
    }),

  cancelSubscription: adminProcedure.mutation(async ({ ctx }) => {
    const tenantId = ctx.session.user.tenantId;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const tenant = await ctx.db.tenant.findUniqueOrThrow({
      where: {
        id: tenantId,
      },
      include: {
        profile: true,
      },
    });

    const subscriptionId = tenant.profile.stripeSubscriptionId;

    if (!subscriptionId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Tenant does not have a subscription",
      });
    }

    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return;
  }),
});
