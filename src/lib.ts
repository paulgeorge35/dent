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

export async function uploadFile(
  file?: { extension: string; contentType: string; base64: string } | null,
) {
  if (file) {
    const s3 = new S3({
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: env.R2_REGION,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });

    const buffer = Buffer.from(file.base64.split(",")[1]!, "base64");

    const key = `avatar/${DateTime.now().toMillis()}.${file.extension}`;

    const uploadParams = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentEncoding: "base64",
      ACL: "public-read",
      ContentType: file.contentType,
    });

    await s3.send(uploadParams);

    return new URL(`${env.R2_PUBLIC_URL}/${key}`).toString();
  }

  return null;
}
