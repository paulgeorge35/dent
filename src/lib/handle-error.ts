import { isRedirectError } from "next/dist/client/components/redirect";
import { toast } from "sonner";
import { z } from "zod";

export function getErrorMessage(err: unknown) {
  const unknownError = "global.fallback";

  if (err instanceof z.ZodError) {
    const error = err.issues[0]?.message;
    return error ?? unknownError;
  }
  if (err instanceof Error) {
    return err.message;
  }
  if (isRedirectError(err)) {
    throw err;
  }
  return unknownError;
}

export function showErrorToast(err: unknown, t?: (key: string) => string) {
  const errorMessage = t ? t(getErrorMessage(err)) : getErrorMessage(err);
  return toast.error(errorMessage);
}
