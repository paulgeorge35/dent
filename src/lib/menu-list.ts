import {
  Users,
  Settings,
  LayoutGrid,
  type LucideIcon,
  SquareUser,
  Stethoscope,
  CalendarClock,
  CreditCard,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  adminOnly?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Clinic",
      menus: [
        {
          href: "",
          label: "Appointments",
          active: pathname.includes("/appointments"),
          icon: CalendarClock,
          submenus: [
            {
              href: "/appointments/me",
              label: "My Appointments",
              active: pathname === "/appointments/me",
            },
            {
              href: "/appointments/all",
              label: "All Appointments",
              active: pathname === "/appointments/all",
            },
          ],
        },
        {
          href: "/patients",
          label: "Patients",
          active: pathname.includes("/patients"),
          icon: SquareUser,
          submenus: [],
        },
        {
          href: "/staff",
          label: "Staff",
          active: pathname.includes("/staff"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/treatments",
          label: "Treatments",
          active: pathname.includes("/treatments"),
          icon: Stethoscope,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/settings?tab=plan",
          label: "Subscription",
          active: pathname.includes("/settings?tab=plan"),
          icon: CreditCard,
          adminOnly: true,
          submenus: [],
        },
        {
          href: "/settings?tab=account",
          label: "Account",
          active: pathname.includes("/settings?tab=account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
