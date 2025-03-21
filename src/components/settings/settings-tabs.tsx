"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Brush,
  Calendar,
  Hospital,
  LifeBuoy,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const tabs = [
  {
    value: "account",
    icon: User,
  },
  {
    value: "clinic",
    icon: Hospital,
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
    value: "schedule",
    icon: Calendar,
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
  children?: React.ReactNode;
  isAdmin?: boolean;
  tab: string;
}

export default function SettingsTabs({
  children,
  isAdmin,
  tab,
}: SettingsTabsProps) {
  const t = useTranslations("page.settings.tabs");
  const [activeTab, setActiveTab] = useState(tab);
  const router = useRouter();

  const onTabChange = (value: string) => {
    setActiveTab(value);
    router.replace(`/settings?tab=${value}`, { scroll: false });
  };

  return (
    <Tabs defaultValue="account" value={activeTab} className="safe-area">
      <TabsList className="mb-2 md:mb-4 flex h-10 overflow-x-auto md:top-20 z-[5]">
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
