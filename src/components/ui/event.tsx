import { DateTime } from "luxon";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { LoadMore } from "@/app/_components/events/events-actions";
import { ExternalLink } from "lucide-react";
import {
  type ParticipantWithUser,
  type EventWithParticipants,
} from "@/server/api/routers/event";
import AvatarComponent from "../avatar-component";
import PulsingDot from "./pulsing-dot";
import { Badge } from "./badge";
import { api } from "@/trpc/server";

interface EventCardProps {
  event: EventWithParticipants;
  position: "start" | "end";
  type?: "upcoming" | "past";
  className?: string;
}

export class EventUtilClass {
  event: EventWithParticipants;

  constructor(event: EventWithParticipants) {
    this.event = event;
  }

  locationString = () =>
    `${this.event.county ? `${this.event.county}` : ""}${this.event.county && this.event.location ? " - " : ""}${this.event.location ? this.event.location : ""}`;

  interested = () => this.event.participants.filter((p) => p.following).length;

  attended = () => this.event.participants.filter((p) => p.attended).length;

  hasEnded = () =>
    this.event.end
      ? DateTime.fromJSDate(this.event.end) < DateTime.now()
      : this.event.allDay
        ? DateTime.fromJSDate(this.event.start).endOf("day") < DateTime.now()
        : DateTime.fromJSDate(this.event.start) < DateTime.now();

  isUpcoming = () => DateTime.fromJSDate(this.event.start) > DateTime.now();

  isHappening = () => !this.isUpcoming() && !this.hasEnded();
}

function EventCard({ event, position, type, className }: EventCardProps) {
  const { locationString, interested, attended, isHappening } =
    new EventUtilClass(event);

  return (
    <Card
      className={cn(
        "group relative w-full rounded border lg:w-[calc(50%-12px)]",
        "transition-shadow duration-200 hover:shadow-lg",
        position === "start" ? "lg:self-start" : "lg:self-end",
        className,
      )}
    >
      <EventBullet position={position} date={event.start} />
      <CardHeader>
        {isHappening() && (
          <Badge
            variant="outline"
            className="horizontal center-v absolute right-1 top-1 w-auto gap-2"
          >
            <PulsingDot size="sm" />
            <span className="line-clamp-1 text-xs">Happening now</span>
          </Badge>
        )}
        <CardDescription className="line-clamp-1 text-xs">
          {DateTime.fromJSDate(event.start).toFormat("MMM dd, yyyy, h:mm a")}
          {event.end &&
            ` - ${DateTime.fromJSDate(event.end).toFormat("h:mm a")}`}
          {event.allDay && " - All day"}
        </CardDescription>
        <CardTitle>
          {event.url ? (
            <Link
              target="_blank"
              href={event.url}
              className="horizontal center-v hover:text-blue-700/80"
            >
              {event.title}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            event.title
          )}
        </CardTitle>
        <CardDescription className="line-clamp-1">
          {locationString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="vertical gap-4">
        <p className="line-clamp-3 text-justify text-sm">{event.subtitle}</p>
        <span className="horizontal center-v gap-1 text-muted-foreground">
          {interested() > 0 && (
            <ParticipantsHoverCard
              title="Interested"
              participants={event.participants.filter((p) => p.following)}
            >
              <CardDescription className="w-fit text-xs">
                {interested()} interested
              </CardDescription>
            </ParticipantsHoverCard>
          )}
          {interested() > 0 && attended() > 0 && "·"}
          {attended() > 0 && (
            <ParticipantsHoverCard
              title={type === "past" ? "Attended" : "Attending"}
              participants={event.participants.filter((p) => p.attended)}
            >
              <CardDescription className="w-fit text-xs">
                {attended()} {type === "past" ? "attended" : "attending"}
              </CardDescription>
            </ParticipantsHoverCard>
          )}
        </span>
      </CardContent>
      <CardFooter>
        <Link
          href={`events/${event.id}`}
          className={cn(
            buttonVariants({
              size: "sm",
            }),
          )}
        >
          View Event
        </Link>
      </CardFooter>
    </Card>
  );
}

interface EventTimelineProps extends React.PropsWithChildren {
  className?: string;
  end: boolean;
  type: "upcoming" | "past";
  take: number;
  order: "asc" | "desc";
}

function EventTimeline({
  children,
  type,
  end,
  take,
  order,
}: EventTimelineProps) {
  return (
    <section
      className={cn(
        "vertical relative mb-14 w-full gap-4 lg:mb-24",
        type === "upcoming" && "flex-col-reverse",
      )}
    >
      <div
        className={cn(
          "absolute left-[calc(50%-1px)] top-[48px] hidden h-full border-l-[1px] border-primary lg:block",
          "animate-height-scale",
        )}
      />
      {!end && type === "upcoming" && (
        <>
          <LoadMore
            className="absolute left-1/2 top-0 -translate-x-1/2 transform animate-fadeIn opacity-0 animation-delay-500"
            type={type}
            take={take}
            order={order}
          />
          <div
            className={cn(
              "absolute left-[calc(50%-1px)] top-[36px] h-6 border-l-[1px] border-dashed border-l-primary",
            )}
          />
        </>
      )}
      {((end && type === "upcoming") || type === "past") && (
        <div
          className={cn(
            "absolute left-[50%] top-[48px] hidden h-[2px] w-[7px] max-w-[0%] -translate-x-1/2 transform overflow-hidden bg-primary text-center text-xs text-primary-foreground lg:block",
            "animate-width-scale animation-delay-500",
            type === "past" && "top-[32px] h-4 w-12",
          )}
        >
          {type === "past" && "Today"}
        </div>
      )}
      {!end && type === "past" && (
        <>
          <div
            className={cn(
              "absolute bottom-[-16px] left-[calc(50%-1px)] h-4 border-l-[1px] border-dashed border-l-primary lg:bottom-[-64px]",
            )}
          />
          <LoadMore
            className="absolute bottom-[-52px] left-1/2 -translate-x-1/2 transform animate-fadeIn opacity-0 animation-delay-500 lg:bottom-[-100px]"
            type={type}
            take={take}
            order={order}
          />
        </>
      )}
      {((end && type === "past") || type === "upcoming") && (
        <div
          className={cn(
            "absolute bottom-[-48px] left-[50%] hidden h-[2px] w-[7px] max-w-[0%] -translate-x-1/2 transform overflow-hidden bg-primary text-center text-xs text-primary-foreground lg:block",
            "animate-width-scale animation-delay-500",
            type === "upcoming" && "h-4 w-12",
          )}
        >
          {type === "upcoming" && "Today"}
        </div>
      )}
      {type === "past" && <span className="lg:h-12" />}
      {children}
      {type === "upcoming" && <span className="h-12" />}
    </section>
  );
}

interface EventBulletProps {
  position: "start" | "end";
  date?: Date;
  className?: string;
}

function EventBullet({ position, date }: EventBulletProps) {
  return (
    <>
      <div
        className={cn(
          "absolute bottom-1/2 top-1/2 hidden h-[1px] w-3 max-w-[0%] -translate-y-1/2 transform border-t border-primary transition-transform duration-200 lg:block",
          "animate-width-scale animation-delay-500",
          position === "start" ? "right-[-12px] " : "left-[-12px] ",
          date &&
            position === "start" &&
            "group-hover:translate-x-[6px] group-hover:scale-x-[2]",
          date &&
            position === "end" &&
            "group-hover:-translate-x-[6px] group-hover:scale-x-[2]",
        )}
      />
      <div
        className={cn(
          "absolute bottom-1/2 top-1/2 hidden h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-foreground bg-background lg:block",
          "transition-colors duration-200 group-hover:border-primary group-hover:bg-primary",
          position === "start" ? "right-[-21px]" : "left-[-14px]",
        )}
      />
      {date && (
        <div
          className={cn(
            "absolute top-1/2 hidden -translate-y-1/2 transform rounded-sm bg-primary px-2 py-1 text-xs font-extralight text-primary-foreground lg:block",
            "opacity-0 transition-opacity delay-200 duration-200 group-hover:opacity-100",
            position === "start"
              ? "right-[-20px] translate-x-full"
              : "left-[-24px] -translate-x-full",
          )}
        >
          {DateTime.fromJSDate(date).toFormat("MMM dd, yyyy")}
        </div>
      )}
    </>
  );
}

interface ParticipantsHoverCardProps {
  children: React.ReactNode;
  title: string;
  participants: ParticipantWithUser[];
}
export async function ParticipantsHoverCard({
  children,
  title,
  participants,
}: ParticipantsHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        className="hidden w-min px-1 py-2 lg:block"
      >
        <span className="vertical gap-2">
          <h3 className="indent-3 text-xs text-muted-foreground">{title}</h3>
          {participants.slice(0, 3).map(async (participant) => {
            const featuredCompany = await api.user.getFeaturedCompany(
              participant.userId,
            );
            return (
              <Link
                key={participant.id}
                href={`/user/${participant.userId}`}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "horizontal center-v justify-start gap-4",
                )}
              >
                <AvatarComponent
                  src={participant.user.profile?.avatar}
                  alt={participant.user.name}
                  fallback={participant.user.name}
                  className="size-8"
                  width={32}
                  height={32}
                />
                <span className="vertical">
                  <p className="text-xs">{participant.user.name}</p>
                  <p className="text-xs font-light text-muted-foreground">
                    {featuredCompany?.name ?? ""}
                  </p>
                </span>
              </Link>
            );
          })}
          {participants.length > 3 && (
            <div className="horizontal center-v">
              <span className="indent-3 text-xs text-muted-foreground">
                and {participants.length - 3}{" "}
                {participants.length > 4 ? "others" : "other"}
              </span>
            </div>
          )}
        </span>
      </HoverCardContent>
    </HoverCard>
  );
}

export { EventCard, EventTimeline };
