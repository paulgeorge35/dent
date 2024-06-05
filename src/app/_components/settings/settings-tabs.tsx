"use client";

import {
  Bell,
  Brush,
  LifeBuoy,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  {
    name: "Account",
    value: "account",
    icon: User,
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
}

export default function SettingsTabs({ children }: SettingsTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab =
    tabs.find((tab) => tab.value === searchParams.get("tab"))?.value ??
    tabs[0]!.value;

  const onTabChange = (value: string) => {
    router.replace(`/settings?tab=${value}`, { scroll: false });
  };

  return (
    <Tabs defaultValue={activeTab} className="w-full md:max-w-3xl">
      <TabsList className="mb-4 grid w-full grid-cols-4 md:max-w-3xl h-10">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => onTabChange(tab.value)}
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
