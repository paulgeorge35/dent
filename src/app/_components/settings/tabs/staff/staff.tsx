import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/server";
import AvatarComponent from "@/components/avatar-component";
import { RoleSelect } from "./components/role-select";
import { Users } from "lucide-react";
import { auth } from "@/auth";
import type { Invitation, User, Profile } from "@prisma/client";
import InvitationDialog from "./components/invitation-dialog";
import { DateTime } from "luxon";
import { ConfirmInvitationDelete } from "./components/confirm-invitation-delete";
import { ConfirmUserDelete } from "./components/confirm-user-delete";
import Link from "next/link";

export default async function Staff() {
  const users = await api.tenant.activeUsers();
  const invitations = await api.tenant.invitations();
  const tenant = await api.tenant.currentTenant();

  const spotsUsed = users.length + invitations.length;

  return (
    <TabsContent
      value="staff"
      className="md:max-w-screen-5xl !mt-0 flex flex-col gap-4"
    >
      <span className="horizontal center-v gap-2">
        <InvitationDialog
          disabled={spotsUsed >= tenant.profile.plan.maxUsers}
        />
        <span className="horizontal center-v h-9 gap-2 rounded-md bg-muted px-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          <p>
            {spotsUsed} / {tenant.profile.plan.maxUsers} Users
          </p>
          <span className="rounded-md border border-border bg-background/50 px-2 py-1 text-sm">
            <Link
              href="/subscription/update"
              className="text-link hover:text-link-hover hover:underline"
            >
              Upgrade
            </Link>{" "}
            to increase your user limit
          </span>
        </span>
      </span>
      <Invitations invitations={invitations} />
      <ActiveUsers users={users} />
    </TabsContent>
  );
}

type ActiveUsersProps = {
  users: (User & { profile: Profile })[];
};

const ActiveUsers = async ({ users }: ActiveUsersProps) => {
  const session = (await auth())!;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
        <CardDescription>Manage your team members.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableCaption>Total Users: {users.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
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
                    src={user.profile.avatar}
                    alt={`${user.profile.firstName} ${user.profile.lastName}`}
                    fallback={`${user.profile.firstName} ${user.profile.lastName}`}
                    width={32}
                    height={32}
                  />
                  {user.profile.firstName} {user.profile.lastName}
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
        <CardDescription>
          Invite your teammates to join your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          {invitations.length > 0 && (
            <TableCaption>Total Invitations: {invitations.length}</TableCaption>
          )}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No invitations
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
                  {DateTime.fromJSDate(invitation.createdAt).toRelative()}
                </TableCell>
                <TableCell>
                  {DateTime.fromJSDate(invitation.expires).toRelative()}
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
