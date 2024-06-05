"use server";

import { encrypt } from "@/lib";
import { db } from "@/server/db";
import { type SessionUser } from "@/types/schema";
import { DateTime } from "luxon";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { sendActivationLink } from "@/auth";
import { redirect } from "next/navigation";

export async function signIn(email: string, password: string) {
  const user = await db.user.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      passwordHash: true,
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

  if (!user) return;

  if (!user.passwordHash) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (user.banned) {
    throw new Error("Your account has been banned");
  }

  if (!user.emailVerified) {
    await sendActivationLink(email, user.name);
    redirect("/sign-in/activate");
  }

  const expires = DateTime.now().plus({ days: 30 }).toJSDate();
  const session = await encrypt(
    {
      ...user,
      passwordHash: user.passwordHash,
    } as SessionUser,
    expires,
  );

  cookies().set("session", session, { expires, httpOnly: true });

  redirect("/");
}
