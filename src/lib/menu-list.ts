import {
  Users,
  LayoutGrid,
  type LucideIcon,
  SquareUser,
  Stethoscope,
  CalendarClock,
  Hammer,
  type LucideProps,
  Pill,
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
  icon: LucideIcon | React.ComponentType<LucideProps>;
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
          href: "/specializations",
          label: "Specializations",
          active: pathname.includes("/specializations"),
          icon: Hammer,
          adminOnly: true,
          submenus: [],
        },
        {
          href: "/stocks",
          label: "Stocks",
          active: pathname.includes("/stocks"),
          icon: Pill,
          adminOnly: true,
          submenus: [],
        },
      ],
    },
  ];
}
