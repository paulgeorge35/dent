import ActivationButton from "./activation-button";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  page: "Sign In",
});

interface ActivatePageProps {
  params: { email: string };
}
export default async function ActivatePage({
  params: { email },
}: ActivatePageProps) {
  return (
    <>
      <div className="grid gap-4 text-center">
        <h1 className="text-3xl font-bold">Activate your account</h1>
        <p className="text-balance text-muted-foreground">
          Your email has not been verified yet. Please check your inbox and
          click on the link we sent you, or request a new one.
        </p>
        <span>
          <ActivationButton email={email} />
        </span>
      </div>
    </>
  );
}
