export const dynamic = "force-dynamic";

import { setSession } from "@/auth";
import { env } from "@/env";
import { googleClient } from "@/oauth";
import { db } from "@/server/db";
import type { SessionUser } from "@/types/schema";
import axios from "axios";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().transform((name) => {
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ");
    return { fullName: name, firstName, lastName };
  }),
  email: z.string(),
  picture: z.string(),
});

export async function GET(request: Request): Promise<Response> {
  try {
    const code = new URL(request.url).searchParams.get("code");
    if (!code) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/sign-in" },
      });
    }

    const options = {
      code,
      redirect_uri: new URL(env.GOOGLE_AUTH_CALLBACK_URL, env.URL).toString(),
    };

    const accessToken = await googleClient.getToken(options);

    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken.token.access_token as string}`,
        },
      },
    );

    const profile = profileSchema.parse(response.data);

    const existingProfile = await db.profile.findFirst({
      where: {
        email: profile.email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        preferredTenantId: true,
        email: true,
        avatar: true,
      },
    });

    if (!existingProfile) {
      const newProfile = await db.profile.create({
        data: {
          email: profile.email,
          firstName: profile.name.firstName ?? "",
          lastName: profile.name.lastName,
          avatar: {
            create: {
              url: profile.picture,
              key: profile.picture,
            },
          },
          accounts: {
            create: {
              type: "oauth",
              provider: "google",
              access_token: accessToken.token.access_token as string,
              refresh_token: accessToken.token.refresh_token as string,
            },
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      });

      await setSession(newProfile as SessionUser, { days: 30 });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const account = await db.account.findFirst({
      where: {
        profileId: existingProfile.id,
        provider: "google",
      },
    });

    if (!account) {
      await db.account.create({
        data: {
          profileId: existingProfile.id,
          type: "oauth",
          provider: "google",
          access_token: accessToken.token.access_token as string,
          refresh_token: accessToken.token.refresh_token as string,
        },
      });

      await setSession({ ...existingProfile } as SessionUser, { days: 30 });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const preferredTenant = existingProfile.preferredTenantId
      ? await db.user.findFirst({
          where: {
            profileId: existingProfile.id,
            tenantId: existingProfile.preferredTenantId,
            activatedAt: {
              not: null,
            },
            bannedAt: null,
            deletedAt: null,
            tenant: {
              disabledAt: {
                not: null,
              },
              deletedAt: {
                not: null,
              },
            },
          },
          select: {
            id: true,
            role: true,
            tenantId: true,
          },
        })
      : null;

    await setSession(
      { ...existingProfile, user: preferredTenant } as SessionUser,
      { days: 30 },
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 302,
      headers: { Location: "/sign-in" },
    });
  }
}
