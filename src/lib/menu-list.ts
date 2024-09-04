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
  hideLabel?: boolean;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "dashboard",
      hideLabel: true,
      menus: [
        {
          href: "/dashboard",
          label: "dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "clinic",
      menus: [
        {
          href: "",
          label: "appointments",
          active: pathname.includes("/appointments"),
          icon: CalendarClock,
          submenus: [
            {
              href: "/appointments/me",
              label: "my-appointments",
              active: pathname === "/appointments/me",
            },
            {
              href: "/appointments/all",
              label: "all-appointments",
              active: pathname === "/appointments/all",
            },
          ],
        },
        {
          href: "/patients",
          label: "patients",
          active: pathname.includes("/patients"),
          icon: SquareUser,
          submenus: [],
        },
        {
          href: "/staff",
          label: "staff",
          active: pathname.includes("/staff"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/treatments",
          label: "treatments",
          active: pathname.includes("/treatments"),
          icon: Stethoscope,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "settings",
      menus: [
        {
          href: "/specializations",
          label: "specializations",
          active: pathname.includes("/specializations"),
          icon: Hammer,
          adminOnly: true,
          submenus: [],
        },
        {
          href: "/stocks",
          label: "stocks",
          active: pathname.includes("/stocks"),
          icon: Pill,
          adminOnly: true,
          submenus: [],
        },
      ],
    },
  ];
}
