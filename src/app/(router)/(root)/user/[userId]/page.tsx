import UserBadges from "@/app/_components/auth/user-badges";
import BackButton from "@/app/_components/back-button";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { constructMetadata } from "@/lib/utils";
import { auth } from "@/auth";

import { Separator } from "@/components/ui/separator";

import AvatarComponent from "@/components/avatar-component";
import { Shell } from "@/components/shell";
import { DateTime } from "luxon";

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const id = params.userId;

  const user = await api.user.get(id).catch((error) => {
    console.error(error);
    notFound();
  });
  return constructMetadata({
    page: `${user.profile.firstName} ${user.profile.lastName}`,
  });
}

interface UserPageProps {
  params: { userId: string };
}

export default async function User({ params: { userId } }: UserPageProps) {
  const session = await auth();
  const user = await api.user.get(userId).catch((error) => {
    console.error(error);
    notFound();
  });
  if (!user) notFound();
  if (session!.user!.id === user.id) {
    redirect("/profile");
  }

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
        {user.lastLoginAt && (
          <span className="text-xs">
            Last active {DateTime.fromJSDate(user.lastLoginAt).toRelative()}
          </span>
        )}
        <Separator className="my-4" />
      </section>
    </Shell>
  );
}
