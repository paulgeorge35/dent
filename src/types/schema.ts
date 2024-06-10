import { ProfileSchema, UserSchema } from "prisma/generated/zod";
import { z } from "zod";

export const userCompleteSchema = UserSchema.merge(
  z.object({
    profile: ProfileSchema,
  }),
);

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.enum(["ADMIN", "USER"]),
  profile: z.object({
    avatar: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export const sessionSchema = z.object({
  user: sessionUserSchema,
  expires: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;

export type SessionUser = z.infer<typeof sessionUserSchema>;

export type UserComplete = z.infer<typeof userCompleteSchema>;

export const emailSchema = z.union([
  z.literal(""),
  z.string().email("Invalid email address").max(50),
]);
