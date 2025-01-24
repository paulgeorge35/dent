import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    DIRECT_DATABASE_URL: z.string().url(),
    DEFAULT_TTL: z.coerce.number().int().positive().default(30),
    DEFAULT_SWR: z.coerce.number().int().default(60),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_SECRET: z.string(),
    SALT_ROUNDS: z.coerce.number().int().positive().default(10),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_AUTH_CALLBACK_URL: z.string(),
    URL: z.string(),
    DOMAIN: z.string(),
    RESEND_API_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_PUBLIC_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_REGION: z.string(),
    R2_BUCKET_NAME: z.string(),
    R2_ACCOUNT_ID: z.string(),
    R2_PUBLIC_URL: z.string(),
    R2_FILE_TTL: z.coerce.number().int().positive().default(15),
    POSTGRES_URL: z.string().url(),
    POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL_NO_SSL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),
    POSTGRES_USER: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DATABASE: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
    DEFAULT_TTL: process.env.DEFAULT_TTL,
    DEFAULT_SWR: process.env.DEFAULT_SWR,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    URL: process.env.VERCEL_URL || process.env.URL,
    DOMAIN: process.env.DOMAIN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_AUTH_CALLBACK_URL: process.env.GOOGLE_AUTH_CALLBACK_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_REGION: process.env.R2_REGION,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
    R2_FILE_TTL: process.env.R2_FILE_TTL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
