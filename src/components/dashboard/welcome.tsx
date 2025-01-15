import { useTranslations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import AvatarComponent from "../shared/avatar-component";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";

type WelcomeProps = {
  name: string;
  avatar?: string;
  appointments: number;
  className?: string;
};

export default async function Welcome({
  name,
  avatar,
  appointments,
  className,
}: WelcomeProps) {
  const t = await useTranslations("page.dashboard.welcome");
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex !flex-row items-center gap-4">
        <AvatarComponent
          alt={name}
          src={avatar}
          width={80}
          height={80}
          fallback={name}
          className="!w-20 !h-20"
          randomColor
        />
        <span className="vertical">
          <CardTitle className="text-2xl">{t("title", { name })}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </span>
      </CardHeader>
      <CardContent>
        {t("appointments", { count: appointments })}
      </CardContent>
      <Separator />
      <CardFooter className="justify-between pt-4">
        <CurrentTasks />
        <Link href="/appointments/me">
          <Button variant="link" className="horizontal gap-2 !px-0">
            {t("view-appointments")}
            <ArrowRightIcon className="size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

async function CurrentTasks() {
  const t = await useTranslations("page.dashboard.welcome");
  return (
    <div className="vertical">
      <p className="shrink-0 text-sm font-medium">{t("current-tasks")}</p>
      <span className="horizontal center-v gap-2">
        <Progress value={50} className="w-20 md:40 shrink-0" />
        <p className="shrink-0 text-sm">3/6</p>
      </span>
    </div>
  );
}
