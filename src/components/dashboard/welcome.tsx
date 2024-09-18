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

export default function Welcome({ name, avatar, appointments, className }: WelcomeProps) {
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
          <CardTitle className="text-2xl">Welcome back, {name}!</CardTitle>
          <CardDescription>Here is your summary for today.</CardDescription>
        </span>
      </CardHeader>
      <CardContent>
        You have <span className="font-bold">{appointments}</span>{" "}
        appointment(s) today.
      </CardContent>
      <Separator />
      <CardFooter className="justify-between pt-4">
        <CurrentTasks />
        <Link href="/appointments/me">
          <Button variant="link" className="horizontal gap-2 !px-0">
            View all appointments
            <ArrowRightIcon className="size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function CurrentTasks() {
  return (
    <div className="vertical">
      <p className="shrink-0 text-sm font-medium">Current tasks</p>
      <span className="horizontal center-v gap-2">
        <Progress value={50} className="w-40 shrink-0" />
        <p className="shrink-0 text-sm">3/6</p>
      </span>
    </div>
  );
}
