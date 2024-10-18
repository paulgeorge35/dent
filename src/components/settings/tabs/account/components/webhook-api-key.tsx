"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showErrorToast } from "@/lib/handle-error";
import { Copy, Plus, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useBoolean } from "react-hanger";

interface WebhookApiKeyFormProps {
    webhookApiKey: string | null;
}

export default function WebhookApiKeyForm({ webhookApiKey }: WebhookApiKeyFormProps) {
    const t = useTranslations("page.settings.tabs.account.webhook-api-key");
    const tDialog = useTranslations("page.settings.tabs.account.webhook-api-key.dialog");
    const confirmationDialog = useBoolean(false)
    const router = useRouter();

    const { mutate, isPending } = api.user.updateWebhookApiKey.useMutation({
        onSuccess: () => {
            toast.success(t("status.success"));
            router.refresh();
            confirmationDialog.setValue(false);
        },
        onError: (error) => {
            showErrorToast(error);
        },
    });

    const onCopy = () => {
        navigator.clipboard.writeText(webhookApiKey ?? "");
        toast.success(t("copied"));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 horizontal gap-2">
                <span className="horizontal center-v gap-2 border border-input rounded-md grow">
                    <Input value={webhookApiKey ?? ""} readOnly className="border-none focus-visible:ring-0" />
                    {webhookApiKey && <Button onClick={onCopy} variant="ghost" className="!p-0 !size-8 m-1">
                        <Copy className="size-4" />
                    </Button>}
                </span>
                <Button
                    isLoading={isPending}
                    onClick={() => webhookApiKey ? confirmationDialog.setValue(true) : mutate()}
                    Icon={webhookApiKey ? RotateCcw : Plus}
                    variant="expandIcon"
                    iconPlacement="left"
                    type="submit"
                    className="col-span-2 sm:w-fit"
                >
                    {webhookApiKey ? t("regenerate") : t("generate")}
                </Button>
                <ConfirmationDialog
                    open={confirmationDialog.value}
                    onOpenChange={confirmationDialog.setValue}
                    t={tDialog}
                    loading={isPending}
                    onConfirm={() => mutate()}
                />
            </CardContent>
        </Card>
    );
}
