import {
  AvatarSchema,
  EventInitiatorSchema,
  EventStatusSchema,
  EventTypeSchema,
  MaterialSchema,
  ProfileSchema,
  RelatedServiceSchema,
  ServiceMaterialSchema,
  ServiceSchema,
  SpecialitySchema,
  StatusSchema,
  TenantProfileSchema,
  TenantSchema,
  UserSchema,
} from "prisma/generated/zod";
import { z } from "zod";

export const userCompleteSchema = UserSchema.merge(
  z.object({
    profile: ProfileSchema.merge(
      z.object({
        avatar: AvatarSchema.nullable(),
      }),
    ),
    speciality: SpecialitySchema.nullable(),
  }),
);
const workingHoursSchema = z.object({
  daysOfWeek: z.array(z.number()),
  startTime: z.string(),
  endTime: z.string(),
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
        profile: TenantProfileSchema.merge(
          z.object({
            avatar: AvatarSchema.nullable(),
          }),
        ),
        users: z.array(
          z.object({
            profile: ProfileSchema.pick({
              firstName: true,
            }).merge(
              z.object({
                avatar: AvatarSchema.nullable(),
              }),
            ),
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
        profile: TenantProfileSchema.merge(
          z.object({
            avatar: AvatarSchema.nullable(),
          }),
        ),
        users: z.array(
          z.object({
            profile: ProfileSchema.pick({
              firstName: true,
            }).merge(
              z.object({
                avatar: AvatarSchema.nullable(),
              }),
            ),
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
  avatar: AvatarSchema.nullable(),
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
  z.string({
    required_error: "email.required",
  }).email("email.invalid").max(50),
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

export const fileCreateInputSchema = z.object({
  key: z.string(),
  name: z.string(),
  extension: z.string(),
  contentType: z.string(),
  size: z.number(),
});

export const patientSchema = z.object({
  firstName: z.string({
    required_error: "firstName.required",
  }).min(1, "firstName.required"),
  lastName: z.string({
    required_error: "lastName.required",
  }).min(1, "lastName.required"),
  gender: z.string().optional(),
  dob: z.date().optional(),
  email: emailSchema.optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  status: StatusSchema.optional().default("ACTIVE"),
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
});

const quizCreateInput = z
  .object({
    answers: z.array(z.number().nullish()).transform((val) => val ?? []),
  })
  .optional()
  .transform((val) => ({
    ...val,
    answers: val?.answers.map((answer) => answer ?? -1),
  }));

const appointmentCreateInputBase = z.object({
  title: z.string().default("Appointment"),
  description: z
    .string()
    .max(255, "global.max-length")
    .optional(),
  date: z.date({
    invalid_type_error: "date.invalid",
    required_error: "date.required",
  }),
  allDay: z.boolean().default(false),
  start: z.date().optional(),
  end: z.date().optional(),
  type: EventTypeSchema.optional().default("APPOINTMENT"),
  status: EventStatusSchema.optional().default("CREATED"),
  initiator: EventInitiatorSchema.optional().default("SYSTEM"),
  serviceId: z.string({ required_error: "global.required" }),
  quiz: quizCreateInput,
  files: z.array(fileCreateInputSchema).optional(),
  userId: z.string().optional(),
});

export const appointmentCreateInput = z
  .object({
    ...appointmentCreateInputBase.shape,
    patient: z.union([
      z.object({
        id: z.string(),
      }),
      patientSchema,
    ]),
  })
  .superRefine(({ start, end, allDay }, ctx) => {
    if (start && end && start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "date.start-after-end",
        path: ["date"],
      });
    }
    if (!allDay && !start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Time is required",
        path: ["date"],
      });
    }
    if (!allDay && !end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Time is required",
        path: ["date"],
      });
    }
  });

export const medicalCheckupSchema = z.object({});

export type MedicalCheckupSchema = z.infer<typeof medicalCheckupSchema>;

export const serviceCompleteSchema = ServiceSchema.extend({
  materials: z.array(
    ServiceMaterialSchema.extend({
      material: MaterialSchema,
    }),
  ),
  children: z.array(RelatedServiceSchema),
});

export type ServiceComplete = z.infer<typeof serviceCompleteSchema>;