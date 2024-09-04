import { env } from "@/env";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { db } from "@/server/db";
import type { Tenant, TenantProfile } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

const firstPaymentMetadataSchema = z.union([
  z.object({
    userId: z.string({ required_error: "User ID is required" }),
    email: z.string({ required_error: "Email is required" }),
    name: z.string({ required_error: "Name is required" }),
    avatarId: z.string().nullish(),
    planId: z.string({ required_error: "Plan ID is required" }),
    size: z.string().optional(),
  }),
  z.object({
    userId: z.string({ required_error: "User ID is required" }),
    planId: z.string({ required_error: "Plan ID is required" }),
  }),
]);

const findStripeSubscription = async (subscriptionId: string) => {
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
    });

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const findOrCreateTenantAndUser = async (subscription: Stripe.Subscription) => {
  return await db.$transaction(async (tx) => {
    const metadata = firstPaymentMetadataSchema.parse(subscription.metadata);
    let tenant = await tx.tenant.findFirst({
      where: { users: { some: { id: metadata.userId } } },
      include: { profile: true },
    });

    if (!tenant) {
      if ("email" in metadata) {
        const profile = await tx.profile.findUnique({
          where: { email: metadata.email },
        });
        if (!profile) {
          console.error("Profile not found");
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Profile not found",
          });
        }

        await tx.profile.update({
          where: { id: profile.id },
          data: {
            stripeCustomerId: subscription.customer as string,
            stripeFreeTrialUsed: true,
          },
        });

        const plan = await tx.plan.findUnique({
          where: { stripePriceId: metadata.planId },
        });

        if (!plan) {
          console.error("Plan not found");
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Plan not found",
          });
        }

        tenant = await tx.tenant.create({
          data: {
            email: metadata.email,
            trialExpiresAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : undefined,
            profile: {
              create: {
                name: metadata.name,
                size: metadata.size,
                avatar: metadata.avatarId ? {
                  connect: { id: metadata.avatarId },
                } : undefined,
                planId: plan.id,
                activeSubscription:
                  subscription.status === "active" ||
                  subscription.status === "trialing",
                stripeSubscriptionId: subscription.id,
              },
            },
            users: {
              create: {
                id: metadata.userId,
                role: "ADMIN",
                activatedAt: new Date(),
                profileId: profile.id,
              },
            },
          },
          include: { profile: true },
        });
      } else {
        console.error(
          "Tenant not found and insufficient metadata to create one",
        );
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tenant not found and insufficient metadata to create one",
        });
      }
    }

    return tenant;
  });
};

const updateTenantSubscription = async (
  tenant: Tenant & {
    profile: TenantProfile;
  },
  subscription: Stripe.Subscription,
) => {
  const newPriceId = subscription.items.data[0]?.price?.id;
  if (!newPriceId) {
    console.error("Price ID not found");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Price ID not found",
    });
  }

  const plan = await db.plan.findUnique({
    where: { stripePriceId: newPriceId },
  });
  if (!plan) {
    console.error("Plan not found");
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Plan not found",
    });
  }

  await db.tenant.update({
    where: { id: tenant.id },
    data: {
      profile: {
        update: {
          planId: plan.id,
          activeSubscription:
            subscription.status === "active" ||
            subscription.status === "trialing",
          stripeSubscriptionId: subscription.id,
        },
      },
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");

    const event: Stripe.Event | null = stripe.webhooks.constructEvent(
      payload,
      signature!,
      webhookSecret,
    );

    const handleSubscriptionEvent = async (subscriptionId: string) => {
      const subscription = await findStripeSubscription(subscriptionId);
      if (!subscription) {
        console.error("Subscription not found");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      const tenant = await findOrCreateTenantAndUser(subscription);
      await updateTenantSubscription(tenant, subscription);
    };

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event.data.object.id);
        break;
      case "invoice.paid":
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) {
          console.error("Subscription ID not found");
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Subscription ID not found",
          });
        }
        await handleSubscriptionEvent(subscriptionId);
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}
