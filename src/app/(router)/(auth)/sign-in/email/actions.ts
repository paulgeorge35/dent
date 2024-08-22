"use server";

import { encrypt } from "@/lib";
import { db } from "@/server/db";
import type { SessionUser } from "@/types/schema";
import { DateTime } from "luxon";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signIn(email: string, password: string) {
  const user = await db.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: { email },
    });

    if (!profile) return;

    if (profile.preferredTenantId) {
      const tenant = await tx.tenant.findUnique({
        where: { id: profile.preferredTenantId, deletedAt: null },
      });

      if (!tenant) return;

      return tx.user.findFirst({
        where: {
          profile: {
            email,
            auth: {
              some: {
                type: "credentials",
                provider: "database",
                passwordHash: { not: null },
              },
            },
          },
          tenant: {
            deletedAt: null,
          },
          tenantId: tenant.id,
          deletedAt: null,
        },
        include: {
          profile: {
            select: {
              id: true,
              email: true,
              avatar: true,
              firstName: true,
              lastName: true,
              auth: true,
            },
          },
        },
      });
    }

    return tx.user.findFirst({
      where: {
        profile: {
          email,
          auth: {
            some: {
              type: "credentials",
              provider: "database",
              passwordHash: { not: null },
            },
          },
        },
        deletedAt: null,
      },
      include: {
        profile: {
          select: {
            id: true,
            email: true,
            avatar: true,
            firstName: true,
            lastName: true,
            auth: true,
          },
        },
      },
    });
  });

  if (!user) return;

  const auth = user.profile.auth.find((a) => a.type === "credentials");

  if (!auth) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, auth.passwordHash!);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (user.bannedAt) {
    throw new Error("Your account has been banned");
  }

  const expires = DateTime.now().plus({ days: 30 }).toJSDate();
  const session = await encrypt(
    {
      ...user.profile,
      user: {
        id: user.id,
        role: user.role,
        tenantId: user.tenantId,
      },
    },
    expires,
  );

  cookies().set("session", session, { expires, httpOnly: true });

  redirect("/");
}
