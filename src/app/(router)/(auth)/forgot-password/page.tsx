import Link from "next/link";
import ForgotPasswordForm from "./forgot-password-form";
import { constructMetadata } from "@/lib/utils";
import { useTranslations } from "@/lib/translations";

export const metadata = constructMetadata({
  page: "Forgot Password",
});

export default async function ForgotPassword() {
  const t = await useTranslations("page.auth.forgot-password");
  return (
    <>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-balance text-muted-foreground">{t("subtitle")}</p>
      </div>

      <ForgotPasswordForm />

      <Link href="/sign-in" className="text-center underline">
      {t("login")}
      </Link>
    </>
  );
}
