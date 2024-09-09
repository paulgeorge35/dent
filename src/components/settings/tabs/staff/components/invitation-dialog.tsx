"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useMediaQuery from "@/hooks/use-media-query";
import { showErrorToast } from "@/lib/handle-error";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useBoolean } from "react-hanger";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
});

type FormValues = z.infer<typeof schema>;

type InvitationDialogProps = {
  disabled?: boolean;
};

export default function InvitationDialog({ disabled }: InvitationDialogProps) {
  const t = useTranslations("page.settings.tabs.staff.invite");
  const te = useTranslations("errors");
  const queryClient = api.useUtils();
  const router = useRouter();
  const dialogOpen = useBoolean(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const { mutate: invite, isPending } = api.tenant.invite.useMutation({
    onSuccess: () => {
      toast.success(t("status.success.title"), {
        description: t("status.success.description"),
      });
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: (error) => {
      showErrorToast(error, te);
    },
    onSettled: () => {
      void queryClient.tenant.invitations.invalidate();
      form.reset();
    },
  });

  const Credenza = isDesktop ? Dialog : Drawer;
  const CredenzaContent = isDesktop ? DialogContent : DrawerContent;
  const CredenzaHeader = isDesktop ? DialogHeader : DrawerHeader;
  const CredenzaTitle = isDesktop ? DialogTitle : DrawerTitle;
  const CredenzaDescription = isDesktop ? DialogDescription : DrawerDescription;
  const CredenzaFooter = isDesktop ? DialogFooter : DrawerFooter;
  const CredenzaClose = isDesktop ? DialogClose : DrawerClose;
  const CredenzaTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  const onSubmit = form.handleSubmit((values) => {
    invite(values);
  });

  return (
    <Credenza open={dialogOpen.value} onOpenChange={disabled ? undefined : dialogOpen.toggle}>
      <CredenzaTrigger>
        <Button disabled={disabled}>
          {t("trigger")} <PlusIcon className="ml-2 size-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("dialog.title")}</CredenzaTitle>
          <CredenzaDescription>{t("dialog.description")}</CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="grid w-full grid-cols-2 gap-4 px-4 md:px-0"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 w-full md:col-span-1">
                  <FormLabel htmlFor={field.name}>
                    {t("dialog.email.label")}
                  </FormLabel>
                  <Input
                    id={field.name}
                    {...field}
                    placeholder={t("dialog.email.placeholder")}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 w-full md:col-span-1">
                  <FormLabel htmlFor={field.name}>
                    {t("dialog.role.label")}
                  </FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("dialog.role.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">
                        {t("dialog.role.options.admin")}
                      </SelectItem>
                      <SelectItem value="USER">
                        {t("dialog.role.options.user")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <CredenzaFooter>
          {isDesktop && (
            <CredenzaClose>
              <Button variant="outline">{t("dialog.cancel")}</Button>
            </CredenzaClose>
          )}
          <Button
            onClick={onSubmit}
            isLoading={isPending}
            disabled={!form.formState.isValid || form.formState.isSubmitting || isPending}
          >
            {form.formState.isSubmitting
              ? t("dialog.inviting")
              : t("dialog.confirm")}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
