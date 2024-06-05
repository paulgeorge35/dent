import { api } from "@/trpc/server";
import { Ban, ShieldCheck } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserBadgesProps {
  userId: string;
}

export default async function UserBadges({ userId }: UserBadgesProps) {
  const { isAdmin, isBanned } = await api.user.getStatus(userId);

  if (!isAdmin && !isBanned) return null;

  if (isBanned)
    return (
      <Tooltip>
        <TooltipTrigger>
          <Ban className="h-4 w-4 text-red-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Banned</p>
        </TooltipContent>
      </Tooltip>
    );

  if (isAdmin)
    return (
      <Tooltip>
        <TooltipTrigger>
          <ShieldCheck className="h-4 w-4 text-green-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Admin</p>
        </TooltipContent>
      </Tooltip>
    );
}
