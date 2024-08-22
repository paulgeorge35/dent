import UserBadges from "@/app/_components/auth/user-badges";
import BackButton from "@/app/_components/back-button";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import { constructMetadata } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";

import AvatarComponent from "@/components/avatar-component";
import { Shell } from "@/components/shell";

export async function generateMetadata(): Promise<Metadata> {
  const user = await api.user.me();
  return constructMetadata({
    page: `${user.profile.firstName} ${user.profile.lastName}`,
  });
}

export default async function Profile() {
  const user = await api.user.me();

  return (
    <Shell>
      <section className="flex flex-col items-center gap-2">
        <span className="flex w-full justify-between">
          <BackButton />
        </span>
        <AvatarComponent
          src={user.profile.avatar}
          alt={`${user.profile.firstName} ${user.profile.lastName}`}
          fallback={`${user.profile.firstName} ${user.profile.lastName}`}
          width={96}
          height={96}
          className="size-24"
        />
        <span className="flex items-center justify-end gap-2">
          <UserBadges userId={user.id} />
          <h1 className="text-2xl font-bold">
            {user.profile.firstName} {user.profile.lastName}
          </h1>
        </span>
        <p className="text-center text-sm font-extralight text-muted-foreground">
          {user.profile.email}
        </p>
        {user.profile.phone && (
          <p className="text-center text-sm font-extralight text-muted-foreground">
            {user.profile.phone}
          </p>
        )}
        <Separator className="my-4" />
      </section>
    </Shell>
  );
}
