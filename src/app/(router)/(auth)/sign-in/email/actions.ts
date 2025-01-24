"use server";

import { encrypt } from "@/lib";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { DateTime } from "luxon";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(email: string, password: string) {
  const user = await db.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: { email },
      include: {
        accounts: {
          where: {
            type: "password",
            provider: "credentials",
          },
        },
        avatar: true,
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

  if (!user) {
    throw new Error("account.invalid");
  }

  const auth = user.profile.accounts.find((a) => a.type === "password");

  if (!auth) {
    throw new Error("account.invalid");
  }

  if (!auth.passwordHash) {
    throw new Error("account.invalid");
  }

  const isPasswordValid = await bcrypt.compare(password, auth.passwordHash);

  if (!isPasswordValid) {
    throw new Error("account.invalid");
  }

  if (!user.profile.activatedAt) {
    throw new Error("account.inactive");
  }

  const expires = DateTime.now().plus({ days: 30 }).toJSDate();

  if (!user.tenant?.users[0]) {
    throw new Error("account.invalid");
  }

  const session = await encrypt(
    {
      id: user.profile.id,
      avatar: user.profile.avatar,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      email: user.profile.email,
      user: user.tenant
        ? {
            id: user.tenant.users[0].id,
            role: user.tenant.users[0].role,
            tenantId: user.tenant.id,
          }
        : undefined,
    },
    expires,
  );

  (await cookies()).set("session", session, { expires, httpOnly: true });

  redirect("/dashboard");
}
