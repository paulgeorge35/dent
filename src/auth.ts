"use server";

import { MagicLink } from "@/components/emails/magic-link";
import type { TokenType } from "@prisma/client";
import crypto from "crypto";
import { DateTime, type DurationLike } from "luxon";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "./env";
import { decrypt, encrypt } from "./lib";
import { db } from "./server/db";
import { resend } from "./server/resend";
import type { SessionUser } from "./types/schema";

const cookieOpts = {
  httpOnly: true,
  // secure: env.NODE_ENV === "production",
  // sameSite: "lax",
  // path: "/",
  // domain: env.NODE_ENV === "production" ? env.DOMAIN : undefined,
  // maxAge: 1000 * 60 * 60 * 24 * 365,
} as const;

export async function sendMagicLink(email: string, tenantId: string) {
  "use server";
  const token = await generateToken({
    tenantId,
    email,
    type: "MAGIC_LINK",
  });

  void resend.emails.send({
    from: "MyDent <hello@mydent.one>",
    to: email,
    subject: "MyDent - Authentication",
    react: MagicLink({
      url: `${env.URL}/api/auth/magic?token=${token}`,
    }),
  });
}

export async function auth() {
  const session = (await cookies()).get("session")?.value;
  return (await decrypt(session)) as SessionUser | null;
}

export async function logOut() {
  "use server";
  (await cookies()).delete("session");
}

export async function setSession(user: SessionUser, duration: DurationLike) {
  const expires = DateTime.now().plus(duration).toJSDate();
  const session = await encrypt(user, expires);

  if (user.user?.id) {
    await db.user.update({
      where: { id: user.user.id },
      data: { lastLoginAt: DateTime.now().toJSDate() },
    });
  }

  (await cookies()).set("session", session, cookieOpts);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = (await decrypt(session)) as SessionUser | null;
  if (!parsed) return;

  const user = await db.user.findFirst({
    where: { profile: { id: parsed.id } },
  });

  if (!user) return;
  if (user.bannedAt ?? user.deletedAt ?? !user.activatedAt) return;

  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: DateTime.now().toJSDate() },
  });

  const expires = DateTime.now().plus({ days: 30 }).toJSDate();

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed, expires),
    ...cookieOpts,
  });
  return res;
}

export async function generateToken({
  tenantId,
  email,
  type,
  length = 64,
  duration = { minutes: 15 },
}: {
  tenantId: string;
  email: string;
  type: TokenType;
  length?: number;
  duration?: DurationLike;
}) {
  const token = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);

  const expires = DateTime.now().plus(duration).toJSDate();

  const user = await db.user.findFirst({
    where: { tenantId, profile: { email } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await db.token.create({
    data: {
      token,
      type,
      profileId: user.profileId,
      expires,
    },
  });

  return token;
}

export async function consumeToken(
  token: string | null | undefined,
  type: TokenType,
) {
  if (!token) {
    throw new Error("Invalid token");
  }

  const existingToken = await db.token.findFirst({
    where: {
      token,
      type,
    },
  });

  if (!existingToken) {
    throw new Error("Invalid token");
  }

  if (existingToken.expires < new Date()) {
    await db.token.delete({
      where: {
        id: existingToken.id,
      },
    });
    throw new Error("Token expired");
  }



  const user = await db.user.findFirst({
    where: {
      profileId: existingToken.profileId,
    },
    select: {
      id: true,
      role: true,
      tenantId: true,
      profile: {
        select: {
          id: true,
          email: true,
          avatar: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await db.token.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    ...user.profile,
    user: {
      id: user.id,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
}
