export const dynamic = "force-dynamic";

import { activateAccount, setSession } from "@/auth";
import { Welcome } from "@/components/emails/welcome";
import { env } from "@/env";
import { googleClient } from "@/oauth";
import { db } from "@/server/db";
import { resend } from "@/server/resend";
import { type SessionUser } from "@/types/schema";
import axios from "axios";
import { DateTime } from "luxon";
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
      redirect_uri: new URL(env.GOOGLE_CALLBACK_URL, env.URL).toString(),
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

    const user = await db.user.findFirst({
      where: {
        email: profile.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        banned: true,
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (user) {
      if (user.banned) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/sign-in?banned=true",
          },
        });
      }
      if (!user.emailVerified) {
        await activateAccount(user.email);
      }
      const account = await db.account.findFirst({
        where: {
          userId: user.id,
          provider: "google",
        },
      });

      if (!account) {
        await db.account.create({
          data: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            access_token: accessToken.token.access_token as string,
            scope: accessToken.token.scope as string,
            token_type: accessToken.token.token_type as string,
            expires_at: accessToken.token.expires_at as Date,
            id_token: accessToken.token.id_token as string,
          },
        });
      }

      await setSession(user as SessionUser, { days: 30 });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const newUser = await db.user.create({
      data: {
        email: profile.email,
        name: profile.name.fullName,
        role: "USER",
        emailVerified: DateTime.now().toJSDate(),
        profile: {
          create: {
            firstName: profile.name.firstName ?? "",
            lastName: profile.name.lastName,
            avatar: profile.picture,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    await setSession(newUser as SessionUser, { days: 30 });

    void resend.emails.send({
      from: "MyDent <contact@paulgeorge.dev>",
      to: newUser.email,
      subject: "MyDent - Welcome",
      react: Welcome({
        name: newUser.name,
        url: env.URL,
      }),
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
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
