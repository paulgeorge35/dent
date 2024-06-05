import { auth } from "@/auth";
import { type Role } from "@prisma/client";
import { type ReactNode } from "react";

interface RenderOnRoleProps {
  roles: Role[];
  className?: string;
  children: ReactNode | ReactNode[];
}

export default async function RenderOnRole({
  roles,
  className,
  children,
}: RenderOnRoleProps) {
  const session = await auth();

  if (!roles.includes(session.role)) {
    return null;
  }

  return <span className={className}>{children}</span>;
}
