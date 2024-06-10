"use server";

import { generateToken } from "@/auth";
import { Welcome } from "@/components/emails/welcome";
import { env } from "@/env";
import { db } from "@/server/db";
import { resend } from "@/server/resend";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  county: string;
}

export async function signUp({
  firstName,
  lastName,
  email,
  password,
  // county,
}: SignUpParams) {
  await db.$transaction(async (tx) => {
    const existingUser = await tx.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await tx.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        passwordHash: await bcrypt.hash(password, 10),
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Error creating user");
    }

    const account = await tx.account.create({
      data: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
      },
    });

    if (!account) {
      throw new Error("Error creating account");
    }

    const token = await generateToken(email, "ACTIVATION");

    void resend.emails.send({
      from: "MyDent <contact@paulgeorge.dev>",
      to: email,
      subject: "MyDent - Welcome",
      react: Welcome({
        name: user.name,
        url: `${env.URL}/api/auth/activate?token=${token}`,
        verify: true,
      }),
    });
  });

  redirect("/sign-up/activate");
}
