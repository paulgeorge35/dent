import AvatarComponent from "@/components/shared/avatar-component";
import type { Profile, User, Event, Avatar } from "@prisma/client";
import Link from "next/link";

export default function resourceLabelContent(
  user?: User & {
    profile: Profile & {
      avatar: Avatar | null;
    };
    events: Event[];
  },
) {
  if (!user) return null;
  return (
    <Link
      href={`/user/${user.id}`}
      className="flex items-center gap-2 rounded-sm px-2 hover:bg-muted"
    >
      <AvatarComponent
        src={user.profile.avatar?.url}
        alt={`${user.profile.firstName} ${user.profile.lastName}`}
        fallback={`${user.profile.firstName} ${user.profile.lastName}`}
        className="size-9"
        width={36}
        height={36}
      />
      <div className="flex flex-col items-start">
        <h1>
          {user.profile.firstName} {user.profile.lastName}
        </h1>

        <p className="h-5 text-sm text-muted-foreground">
          {user.events.length
            ? `${user.events.length} patient${user.events.length > 1 ? "s" : ""}`
            : "No patients"}
        </p>
      </div>
    </Link>
  );
}
