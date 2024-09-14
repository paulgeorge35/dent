import {
  CheckCircledIcon,
  CrossCircledIcon,
  MinusCircledIcon,
} from "@radix-ui/react-icons";
import { Shield, UserCircle } from "lucide-react";
import type { RoleType, StatusType } from "prisma/generated/zod";

export const getStatusIcon = (status: StatusType) => {
  const statusIcon = {
    ACTIVE: CheckCircledIcon,
    INACTIVE: CrossCircledIcon,
  };

  return statusIcon[status] || MinusCircledIcon;
};

export const getRoleIcon = (role: RoleType) => {
  const roleIcon = {
    ADMIN: Shield,
    USER: UserCircle,
  };

  return roleIcon[role] || UserCircle;
};
