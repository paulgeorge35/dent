import { Shell } from "./shell";
import SidebarLink from "./nav-link";
import Image from "next/image";

export default function NavBar() {
  return (
    <Shell variant="nav">
      <SidebarLink href="/home" className="horizontal center-v gap-4" main>
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        Dashboard
      </SidebarLink>
      <SidebarLink href="/patients">Patients</SidebarLink>
      <SidebarLink href="/documents">Documents</SidebarLink>
      <SidebarLink href="/settings">Settings</SidebarLink>
    </Shell>
  );
}
