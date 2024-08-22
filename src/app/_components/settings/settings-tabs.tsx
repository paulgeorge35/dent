"use client";

import { Bell, Brush, CreditCard, LifeBuoy, User, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const tabs = [
  {
    name: "Account",
    value: "account",
    icon: User,
  },
  {
    name: "Plan",
    value: "plan",
    icon: CreditCard,
    adminsOnly: true,
  },
  {
    name: "Staff",
    value: "staff",
    icon: Users,
    adminsOnly: true,
  },
  {
    name: "Customization",
    value: "customization",
    icon: Brush,
  },
  {
    name: "Notifications",
    value: "notifications",
    icon: Bell,
  },
  {
    name: "Support",
    value: "support",
    icon: LifeBuoy,
  },
];

interface SettingsTabsProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export default function SettingsTabs({ children, isAdmin }: SettingsTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = useMemo(
    () =>
      tabs.find((tab) => tab.value === searchParams.get("tab"))?.value ??
      tabs[0]!.value,
    [searchParams],
  );

  const onTabChange = (value: string) => {
    router.replace(`/settings?tab=${value}`, { scroll: false });
  };

  return (
    <Tabs defaultValue={activeTab} className="w-full md:max-w-5xl">
      <TabsList className="mb-4 flex h-10 w-full md:max-w-5xl">
        {tabs
          .filter((tab) => tab.adminsOnly ?? isAdmin)
          .map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => onTabChange(tab.value)}
              className="flex-1"
            >
              <p className="hidden md:block">{tab.name}</p>
              <tab.icon className="md:hidden" />
            </TabsTrigger>
          ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
