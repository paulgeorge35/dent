"use server";

import { env } from "./env";
import { decrypt, encrypt } from "./lib";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { resend } from "./server/resend";
import { MagicLink } from "@/components/emails/magic-link";
import { type SessionUser } from "./types/schema";
import { db } from "./server/db";
import Activation from "./components/emails/activation";
import { type TokenType } from "@prisma/client";
import crypto from "crypto";
import { DateTime, type DurationLike } from "luxon";

export async function sendMagicLink(email: string) {
  "use server";
  const token = await generateToken(email, "MAGIC_LINK");

  void resend.emails.send({
    from: "MyDent <hello@mydent.one>",
    to: email,
    subject: "MyDent - Authentication",
    react: MagicLink({
      url: `${env.URL}/api/auth/magic?token=${token}`,
    }),
  });
}

export async function sendActivationLink(email: string, name: string) {
  const token = await generateToken(email, "ACTIVATION");

  void resend.emails.send({
    from: "MyDent <hello@mydent.one>",
    to: email,
    subject: "MyDent - Account Activation",
    react: Activation({
      name,
      url: `${env.URL}/api/auth/activate?token=${token}`,
    }),
  });
}

export async function activateAccount(email: string) {
  await db.user.update({
    where: { email },
    data: {
      emailVerified: DateTime.now().toJSDate(),
    },
  });
}

export async function auth() {
  const session = cookies().get("session")?.value;
  return (await decrypt(session!)) as SessionUser;
}

export async function logOut() {
  "use server";
  cookies().delete("session");
}

export async function setSession(user: SessionUser, duration: DurationLike) {
  const expires = DateTime.now().plus(duration).toJSDate();
  const session = await encrypt(user, expires);

  cookies().set("session", session, { expires, httpOnly: true });
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = (await decrypt(session)) as SessionUser | null;
  if (!parsed) return;

  const user = await db.user.findFirst({
    where: { id: parsed.id },
  });

  if (!user || user.banned) return;

  const expires = DateTime.now().plus({ days: 30 }).toJSDate();

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed, expires),
    httpOnly: true,
    expires,
  });
  return res;
}

export async function generateToken(
  email: string,
  type: TokenType,
  length = 64,
  duration: DurationLike = { minutes: 15 },
) {
  const token = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);

  const expires = DateTime.now().plus(duration).toJSDate();

  const user = await db.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await db.token.create({
    data: {
      token,
      type,
      userId: user.id,
      expires,
    },
  });

  return token;
}

export async function consumeToken(
  token: string | null | undefined,
  type: TokenType,
) {
  return await db.$transaction(async (tx) => {
    if (!token) {
      throw new Error("Invalid token");
    }

    const existingToken = await tx.token.findFirst({
      where: {
        token,
        type,
      },
    });

    if (!existingToken) {
      throw new Error("Invalid token");
    }

    if (existingToken.expires < new Date()) {
      await tx.token.delete({
        where: {
          id: existingToken.id,
        },
      });
      throw new Error("Token expired");
    }

    const user = (await tx.user.findFirst({
      where: {
        id: existingToken.userId,
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
    })) as SessionUser;

    await tx.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  });
}
