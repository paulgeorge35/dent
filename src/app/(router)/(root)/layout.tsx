import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Shell } from "@/components/shell";
import NavBar from "@/components/navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <Shell variant="layout">
      <NavBar />
      {children}
    </Shell>
  );
}
