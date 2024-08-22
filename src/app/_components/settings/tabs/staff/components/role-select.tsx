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

type RoleSelectProps = {
  userId: string;
  value: Role;
  disabled?: boolean;
};

export const RoleSelect = ({ userId, value, disabled }: RoleSelectProps) => {
  const { mutate } = api.tenant.updateRole.useMutation();

  const handleChange = (role: Role) => {
    mutate({ userId: userId, role });
  };
  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled}>
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
