import UserBadges from "@/app/_components/auth/user-badges";
import BackButton from "@/app/_components/back-button";
import CompanyCard from "@/app/_components/settings/company-card";
import SocialBadge from "@/app/_components/settings/social-badge";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { cn, constructMetadata } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";

import AvatarComponent from "@/components/avatar-component";
import { Shell } from "@/components/shell";

import { type Social, type SocialName, socials } from "@/lib/socials";
import RenderOnRole from "@/components/security/render-on-role";
import BanDialog from "@/app/_components/user-table/ban-dialog";
import { Button } from "@/components/ui/button";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

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
    description: user.profile.bio ?? undefined,
  });
}

interface UserPageProps {
  params: { userId: string };
}

export default async function User({ params: { userId } }: UserPageProps) {
  const user = await api.user.get(userId).catch((error) => {
    console.error(error);
    notFound();
  });
  if (!user) notFound();

  const featuredCompany = user.companies.find((company) => company.isFeatured);

  const hasSocials = (Object.keys(socials) as SocialName[]).some(
    (id) => user.social?.[id],
  );

  return (
    <Shell>
      <section className="flex flex-col items-center gap-2">
        <span className="flex w-full justify-between">
          <BackButton />
          <RenderOnRole roles={["ADMIN"]}>
            <BanDialog userId={user.id} banned={user.banned}>
              <Button
                variant={user.banned ? "destructive" : "destructive-outline"}
                className={cn("group", user.banned && "hover:bg-green-700")}
              >
                <LockKeyhole
                  className={cn(
                    "mr-2 size-5",
                    user.banned
                      ? "stroke-white-500 group-hover:hidden"
                      : "group-hover:stroke-white-500",
                  )}
                />
                <LockKeyholeOpen
                  className={cn(
                    "mr-2 size-5",
                    user.banned
                      ? "stroke-white-500 hidden group-hover:block"
                      : "hidden",
                  )}
                />
                <span className="relative">
                  <span
                    className={cn("", user.banned && "group-hover:invisible")}
                  >
                    {user.banned ? "Banned" : "Ban User"}
                  </span>
                  <span
                    className={cn(
                      "absolute left-0 top-0 hidden",
                      user.banned && "group-hover:block",
                    )}
                  >
                    Unban
                  </span>
                </span>
              </Button>
            </BanDialog>
          </RenderOnRole>
        </span>
        <AvatarComponent
          src={user.profile.avatar}
          alt={user.name}
          fallback={user.name}
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
        {hasSocials && (
          <span className="flex flex-wrap gap-2">
            {(Object.keys(socials) as SocialName[]).map((id) => {
              const social: Social = socials[id];
              return (
                <SocialBadge
                  key={social.id}
                  social={social}
                  link={user.social?.[social.id] ?? undefined}
                  size="icon"
                />
              );
            })}
          </span>
        )}
        {featuredCompany && (
          <p className="text-center text-sm font-extralight">
            @<strong>{featuredCompany.name}</strong>
          </p>
        )}
        <p className="text-center text-sm font-extralight text-muted-foreground">
          {user.email}
        </p>
        {user.phone && (
          <p className="text-center text-sm font-extralight text-muted-foreground">
            {user.phone}
          </p>
        )}
        {user.profile.bio && (
          <p className="text-center text-xs font-extralight italic text-muted-foreground">
            {user.profile.bio}
          </p>
        )}
        <Separator className="my-4" />
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {featuredCompany && (
            <CompanyCard
              key={featuredCompany.id}
              company={featuredCompany}
              preview
            />
          )}
          {user.companies
            .filter((company) => company.id !== featuredCompany?.id)
            .map((company) => (
              <CompanyCard key={company.id} company={company} preview />
            ))}
        </section>
      </section>
    </Shell>
  );
}
