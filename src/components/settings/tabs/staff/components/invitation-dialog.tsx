"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import useMediaQuery from "@/hooks/use-media-query";
import { PlusIcon } from "@radix-ui/react-icons";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useBoolean } from "react-hanger";
import { useRouter } from "next/navigation";
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
