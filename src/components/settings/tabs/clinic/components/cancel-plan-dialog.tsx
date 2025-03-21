"use client";

import { api } from "@/trpc/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CancelMembership() {
  const t = useTranslations("page.settings.tabs.clinic.subscription.cancel");
  const router = useRouter();
  const { mutate } = api.stripe.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success(t("status.success"));
      router.refresh();
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="expandIcon"
          Icon={Icons.cancel}
          iconPlacement="left"
          className="w-full md:w-auto"
        >
          {t("trigger")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialog.title")}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("dialog.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              mutate();
            }}
          >
            {t("dialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
