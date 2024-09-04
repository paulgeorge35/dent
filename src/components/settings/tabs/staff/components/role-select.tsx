"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import type { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RoleSelectProps = {
  userId: string;
  value: Role;
  disabled?: boolean;
};

export const RoleSelect = ({ userId, value, disabled }: RoleSelectProps) => {
  const router = useRouter();
  const { mutate, isPending } = api.tenant.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated successfully", {
        description: "The user's role has been updated",
      });
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleChange = (role: Role) => {
    mutate({ userId: userId, role });
  };
  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={disabled ?? isPending}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="USER">Staff</SelectItem>
      </SelectContent>
    </Select>
  );
};
