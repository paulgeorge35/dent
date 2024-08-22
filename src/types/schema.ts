import {
  ProfileSchema,
  UserSchema,
  TenantSchema,
  TenantProfileSchema,
  SpecializationSchema,
} from "prisma/generated/zod";
import { z } from "zod";

export const userCompleteSchema = UserSchema.merge(
  z.object({
    profile: ProfileSchema,
    specialization: SpecializationSchema.nullable(),
  }),
);
const workingHoursSchema = z.object({
  daysOfWeek: z.array(z.number()),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
});

export const parseWorkingHours = (input: unknown) => {
  try {
    return z.array(workingHoursSchema).parse(JSON.parse(input as string));
  } catch {
    return [];
  }
};

export type StaffSchema = z.infer<typeof staffSchema>;

export const staffSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type WorkingHours = z.infer<typeof workingHoursSchema>;

export const tenantAccountSchema = UserSchema.merge(
  z.object({
    tenant: TenantSchema.merge(
      z.object({
        profile: TenantProfileSchema,
        users: z.array(
          z.object({
            profile: ProfileSchema.pick({
              firstName: true,
              avatar: true,
            }),
          }),
        ),
      }),
    ),
  }),
);

export const invitationAccountSchema = z.object({
  token: z.string(),
  invitedBy: z.object({
    profile: ProfileSchema.pick({
      firstName: true,
      lastName: true,
      email: true,
    }),
    tenant: TenantSchema.merge(
      z.object({
        profile: TenantProfileSchema,
        users: z.array(
          z.object({
            profile: ProfileSchema.pick({
              firstName: true,
              avatar: true,
            }),
          }),
        ),
      }),
    ),
  }),
});

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().nullable(),
  user: z
    .object({
      id: z.string(),
      role: z.string(),
      tenantId: z.string(),
    })
    .optional(),
});

export const sessionSchema = z.object({
  user: sessionUserSchema,
  expires: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;

export type SessionUser = z.infer<typeof sessionUserSchema>;

export type UserComplete = z.infer<typeof userCompleteSchema>;

export type TenantAccount = z.infer<typeof tenantAccountSchema>;

export type InvitationAccount = z.infer<typeof invitationAccountSchema>;

export const emailSchema = z.union([
  z.literal(""),
  z.string().email("Invalid email address").max(50),
]);

export const avatarSchema = z
  .union([
    z.string(),
    z.object({
      base64: z.string(),
      extension: z.string(),
      contentType: z.string(),
    }),
  ])
  .nullable();

export type Avatar = z.infer<typeof avatarSchema>;
