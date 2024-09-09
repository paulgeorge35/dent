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
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";
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
  const queryClient = api.useUtils();
  const router = useRouter();
  const dialogOpen = useBoolean(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { mutate: invite, isPending } = api.tenant.invite.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent");
      dialogOpen.setFalse();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      void queryClient.tenant.invitations.invalidate();
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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit((values) => {
    invite(values);
  });

  return (
    <Credenza open={dialogOpen.value} onOpenChange={dialogOpen.toggle}>
      <CredenzaTrigger>
        <Button disabled={disabled}>
          Invite <PlusIcon className="ml-2 size-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Invite</CredenzaTitle>
          <CredenzaDescription>
            Invite your teammates to join the platform.
          </CredenzaDescription>
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
                  <FormLabel htmlFor={field.name}>Email</FormLabel>
                  <Input
                    id={field.name}
                    {...field}
                    placeholder="john@doe.com"
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
                  <FormLabel htmlFor={field.name}>Role</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">Staff</SelectItem>
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
              <Button variant="outline">Cancel</Button>
            </CredenzaClose>
          )}
          <Button
            onClick={onSubmit}
            isLoading={isPending}
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Inviting..." : "Invite"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
