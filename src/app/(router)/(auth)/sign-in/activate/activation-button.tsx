"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useBoolean } from "react-hanger";
import { resendActivationLink } from "./actions";

interface ActivationButtonProps {
  email: string;
}

export default function ActivationButton({ email }: ActivationButtonProps) {
  const [pending, startTransition] = useTransition();
  const requested = useBoolean(false);

  const handleClick = () => {
    startTransition(async () => {
      await resendActivationLink(email);
      requested.setTrue();
    });
  };

  return (
    <Button
      variant="secondary"
      disabled={requested.value}
      onClick={handleClick}
      isLoading={pending}
      size="sm"
    >
      {requested.value
        ? "Activation link sent"
        : "Request a new activation link"}
    </Button>
  );
}
