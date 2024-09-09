import {
  AvatarIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  MinusCircledIcon,
  StarIcon,
} from "@radix-ui/react-icons";
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
    ADMIN: StarIcon,
    USER: AvatarIcon,
  };

  return roleIcon[role] || AvatarIcon;
};
