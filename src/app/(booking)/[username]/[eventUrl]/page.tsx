import Calendar from "@/components/calendar/Calendar";
import CalendarRender from "@/components/calendar/CalendarRender";
import TimeTable from "@/components/calendar/TimeTable";
import SubmitButton from "@/components/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { NewBookingEventAction } from "@/utils/actions";
import { prisma } from "@/utils/prisma";
import {
  CalendarCheck,
  CalendarX,
  Clock,
  Timer,
  Video,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { date } from "zod";

async function getData(username: string, eventUrl: string) {
  const data = await prisma.event.findFirst({
    where: {
      url: eventUrl,
      User: {
        username,
      },
    },
    select: {
      id: true,
      User: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
      title: true,
      description: true,
      duration: true,
      videoCallSoftware: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

async function BookingEvent({
  params,
  searchParams,
}: {
  params: { username: string; eventUrl: string };
  searchParams: { date?: string; time?: string };
}) {
  const data = await getData(params.username, params.eventUrl);

  const dateParam = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  const formattedDate = Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(dateParam);

  const completedDateTime = searchParams.time && searchParams.date;

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {completedDateTime ? (
        <Card className="max-w-[600px] w-full">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr_auto_1fr] gap-4">
            <div>
              <img
                src={data.User?.image as string}
                alt="Profile Image"
                className="size-10 rounded-full"
              />
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {data?.User?.name}
              </p>
              <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {data.description}
              </p>
              <div className="mt-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.duration} Minutes
                  </span>
                </p>
                <p className="flex items-center">
                  <VideoIcon className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>

            <Separator orientation="vertical" className="h-full w-[1px]" />

            <form
              action={NewBookingEventAction}
              className="flex flex-col gap-y-4"
            >
              <input type="hidden" name="fromTime" value={searchParams.time} />
              <input type="hidden" name="eventDate" value={searchParams.date} />
              <input
                type="hidden"
                name="durationOfMeeting"
                value={data.duration}
              />
              <input type="hidden" name="username" value={params.username} />
              <input type="hidden" name="eventId" value={data.id} />
              <input
                type="hidden"
                name="provider"
                value={data.videoCallSoftware}
              />
              <div className="flex flex-col gap-y-2">
                <Label>Your Name</Label>
                <Input name="name" placeholder="Your name" />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Your Email</Label>
                <Input name="email" placeholder="peter@example.com" />
              </div>
              <SubmitButton className="w-full mt-5" text="Book Meeting" />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-[1000px] w-full mx-auto">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4">
            <div>
              <img
                src={data.User?.image as string}
                alt="Profile Image"
                className="size-10 rounded-full"
              />
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {data?.User?.name}
              </p>
              <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {data.description}
              </p>
              <div className="mt-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.duration} Minutes
                  </span>
                </p>
                <p className="flex items-center">
                  <VideoIcon className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>

            <Separator orientation="vertical" />

            <CalendarRender availability={data.User?.availability as any} />

            <Separator orientation="vertical" className="h-full w-[1px]" />

            <TimeTable
              duration={data.duration}
              selectedDate={dateParam}
              username={params.username}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BookingEvent;
