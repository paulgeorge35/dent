"use server";

import { encrypt } from "@/lib";
import { db } from "@/server/db";
import { DateTime } from "luxon";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signIn(email: string, password: string) {
  const user = await db.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: { email },
      include: {
        auth: {
          where: {
            type: "password",
            provider: "credentials",
          },
        },
      },
    });

    if (!profile) return;

    if (profile.preferredTenantId) {
      const tenant = await tx.tenant.findUnique({
        where: {
          id: profile.preferredTenantId,
          deletedAt: null,
          users: {
            some: {
              profileId: profile.id,
              bannedAt: null,
              deletedAt: null,
            },
          },
        },
        include: {
          users: {
            where: {
              profileId: profile.id,
              bannedAt: null,
              deletedAt: null,
            },
            take: 1,
          },
        },
      });

      if (!tenant) return { profile };

      return { profile, tenant };
    }

    return { profile };
  });

  if (!user) return;

  const auth = user.profile.auth.find((a) => a.type === "password");

  if (!auth) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, auth.passwordHash!);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (!user.profile.activatedAt) {
    throw new Error("Your account has not been activated");
  }

  const expires = DateTime.now().plus({ days: 30 }).toJSDate();
  const session = await encrypt(
    {
      ...user.profile,
      user: user.tenant
        ? {
            id: user.tenant.id,
            role: user.tenant.users[0]!.role,
            tenantId: user.tenant.id,
          }
        : undefined,
    },
    expires,
  );

  cookies().set("session", session, { expires, httpOnly: true });

  redirect("/");
}
