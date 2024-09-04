import { type JWTPayload, SignJWT, jwtVerify } from "jose";
import { env } from "./env";
import { type SessionUser } from "./types/schema";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { DateTime } from "luxon";

const key = new TextEncoder().encode(env.AUTH_SECRET);

export async function encrypt(
  payload: SessionUser,
  expires: string | number | Date = "30 days",
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key);
}

export async function decrypt(input?: string): Promise<JWTPayload | null> {
  if (!input) return null;
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (_err) {
    return null;
  }
}