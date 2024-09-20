import { auth } from "@/auth";
import AvatarComponent from "@/components/shared/avatar-component";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import type { Invitation, Profile, User } from "@prisma/client";
import { Info, TriangleAlert, Users } from "lucide-react";
import { DateTime } from "luxon";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { ConfirmInvitationDelete } from "./components/confirm-invitation-delete";
import { ConfirmUserDelete } from "./components/confirm-user-delete";
import InvitationDialog from "./components/invitation-dialog";
import { RoleSelect } from "./components/role-select";

export default async function Staff() {
  const t = await useTranslations("page.settings.tabs.staff");
  const users = await api.tenant.activeUsers();
  const invitations = await api.tenant.invitations();
  const tenant = await api.tenant.currentTenant();
  const { subscription } = await api.stripe.subscription();

  const isCanceled = subscription.cancel_at_period_end;

  const spotsUsed = users.length + invitations.length;
  const noSpotsLeft = spotsUsed >= tenant.profile.plan.maxUsers;

  return (
    <TabsContent
      value="staff"
      className="md:max-w-screen-lg !mt-0 flex flex-col gap-4"
    >
      <span className="horizontal center-v gap-2">
        <InvitationDialog disabled={noSpotsLeft} />
        <span className="horizontal center-v h-9 gap-2 rounded-md bg-muted pl-2 pr-1 text-sm text-muted-foreground">
          <Users className="size-4" />
          <p>
            {spotsUsed} / {tenant.profile.plan.maxUsers} {t("users")}
          </p>
          <Tooltip>
            <TooltipTrigger>
              {noSpotsLeft ? (
                <TriangleAlert className="size-4 text-red-500" />
              ) : (
                <Info className="size-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {noSpotsLeft
                ? t("tooltip-modify", {
                    maxUsers: tenant.profile.plan.maxUsers,
                  })
                : t("tooltip", { maxUsers: tenant.profile.plan.maxUsers })}
            </TooltipContent>
          </Tooltip>
          <span
            className={cn(
              "hidden md:block rounded-md border border-border bg-background/50 px-2 py-1 text-sm",
              {
                hidden: isCanceled,
              },
            )}
          >
            <Link
              href={`/subscription/update?redirectUrl=${encodeURIComponent("/settings?tab=staff")}`}
              className="text-link hover:text-link-hover hover:underline"
            >
              {t("modify")}
            </Link>{" "}
            {t("your-plan-to-fit-needs")}
          </span>
        </span>
      </span>
      <Invitations invitations={invitations} />
      <ActiveUsers users={users} />
    </TabsContent>
  );
}

type ActiveUsersProps = {
  users: (User & { profile: Profile & { avatar: { url: string } | null } })[];
};

const ActiveUsers = async ({ users }: ActiveUsersProps) => {
  const t = await useTranslations("page.settings.tabs.staff");
  const session = (await auth())!;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("active-users.title")}</CardTitle>
        <CardDescription>{t("active-users.description")}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableCaption>
            {t("active-users.total-users")}: {users.length}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("active-users.columns.name")}</TableHead>
              <TableHead>{t("active-users.columns.email")}</TableHead>
              <TableHead>{t("active-users.columns.role")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="text-muted-foreground hover:bg-transparent"
              >
                <TableCell className="flex items-center gap-2 text-secondary-foreground">
                  <AvatarComponent
                    src={user.profile.avatar?.url}
                    alt={`${user.profile.firstName} ${user.profile.lastName}`}
                    fallback={`${user.profile.firstName} ${user.profile.lastName}`}
                    width={32}
                    height={32}
                  />
                  <p>
                    {user.profile.firstName} {user.profile.lastName}
                  </p>
                  {user.id === session.user!.id && (
                    <span className="rounded-full border border-border bg-muted px-2 text-sm text-muted-foreground">
                      {t("active-users.you")}
                    </span>
                  )}
                </TableCell>
                <TableCell>{user.profile.email}</TableCell>
                <TableCell>
                  <RoleSelect
                    disabled={user.id === session.user!.id}
                    userId={user.id}
                    value={user.role}
                  />
                </TableCell>
                <TableCell className="flex justify-end">
                  <ConfirmUserDelete
                    id={user.id}
                    disabled={user.id === session.user!.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

type InvitationsProps = {
  invitations: Omit<Invitation, "token">[];
};

const Invitations = async ({ invitations }: InvitationsProps) => {
  const t = await useTranslations("page.settings.tabs.staff");
  const locale = await getLocale();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("invitations.title")}</CardTitle>
        <CardDescription>{t("invitations.description")}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          {invitations.length > 0 && (
            <TableCaption>
              {t("invitations.total-invitations")}: {invitations.length}
            </TableCaption>
          )}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("invitations.columns.email")}</TableHead>
              <TableHead>{t("invitations.columns.role")}</TableHead>
              <TableHead>{t("invitations.columns.sent")}</TableHead>
              <TableHead>{t("invitations.columns.expires")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  {t("invitations.no-invitations")}
                </TableCell>
              </TableRow>
            )}
            {invitations.map((invitation) => (
              <TableRow
                key={invitation.id}
                className="text-muted-foreground hover:bg-transparent"
              >
                <TableCell>{invitation.email}</TableCell>
                <TableCell>
                  {invitation.role === "ADMIN" ? "Admin" : "Staff"}
                </TableCell>
                <TableCell>
                  {DateTime.fromJSDate(invitation.createdAt).toRelative({
                    locale,
                  })}
                </TableCell>
                <TableCell>
                  {DateTime.fromJSDate(invitation.expires).toRelative({
                    locale,
                  })}
                </TableCell>
                <TableCell className="flex justify-end">
                  <ConfirmInvitationDelete id={invitation.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
