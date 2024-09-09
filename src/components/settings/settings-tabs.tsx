"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Brush, CreditCard, LifeBuoy, User, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const tabs = [
  {
    value: "account",
    icon: User,
  },
  {
    value: "plan",
    icon: CreditCard,
    adminsOnly: true,
  },
  {
    value: "staff",
    icon: Users,
    adminsOnly: true,
  },
  {
    value: "customization",
    icon: Brush,
  },
  {
    value: "notifications",
    icon: Bell,
  },
  {
    value: "support",
    icon: LifeBuoy,
  },
];

interface SettingsTabsProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export default function SettingsTabs({ children, isAdmin }: SettingsTabsProps) {
  const t = useTranslations("page.settings.tabs");
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
          .filter((tab) => !tab.adminsOnly || isAdmin)
          .map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => onTabChange(tab.value)}
              className="flex-1"
            >
              <p className="hidden md:block">{t(`${tab.value}.title`)}</p>
              <tab.icon className="md:hidden" />
            </TabsTrigger>
          ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
