import { nylas } from "@/utils/nylas";
import { prisma } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import Link from "next/link";
import { GetFreeBusyResponse, NylasResponse } from "nylas";
import { date } from "zod";
import { Button } from "../ui/button";

type Props = {
  duration: number;
  selectedDate: Date;
  username: string;
};

const getData = async (username: string, selectedDate: string) => {
  const formatSelectedDate = format(selectedDate, "EEEE");

  const startTime = new Date(selectedDate);
  startTime.setHours(0, 0, 0, 0);

  const endTime = new Date(selectedDate);
  endTime.setHours(23, 59, 59, 999);

  const data = await prisma.availability.findFirst({
    where: {
      day: formatSelectedDate as Prisma.EnumDayFilter,
      User: {
        username,
      },
    },
    select: {
      id: true,
      fromTime: true,
      tillTime: true,
      User: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });

  const nylasCalendar = await nylas.calendars.getFreeBusy({
    identifier: data?.User?.grantId as string,
    requestBody: {
      startTime: Math.floor(startTime.getTime() / 1000),
      endTime: Math.floor(endTime.getTime() / 1000),
      emails: [data?.User?.grantEmail as string],
    },
  });

  return {
    data,
    nylasCalendar,
  };
};

const calculateDate = (
  date: string,
  timeDuration: { fromTime: string | undefined; tillTime: string | undefined },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  duration: number
) => {
  const now = new Date();

  const currentDate = parse(
    `${date} ${timeDuration.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  const endDate = parse(
    `${date} ${timeDuration.tillTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  /* @ts-ignore */
  const busySlots = nylasData.data[0].timeSlots.map((slot) => ({
    start: fromUnixTime(slot.startTime),
    end: fromUnixTime(slot.endTime),
  }));

  const allSlots = [];
  let prefixSlot = currentDate;
  while (isBefore(prefixSlot, endDate)) {
    allSlots.push(prefixSlot);
    prefixSlot = addMinutes(prefixSlot, duration);
  }

  const freeSlots = allSlots.filter((slot) => {
    const endTime = addMinutes(slot, duration);

    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy: { start: any; end: any }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(endTime, busy.start) && !isAfter(endTime, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(endTime, busy.end))
      )
    );
  });

  return freeSlots.map((slot) => format(slot, "HH:mm"));
};

async function TimeTable({ duration, selectedDate, username }: Props) {
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const { data, nylasCalendar } = await getData(username, formattedDate);
  const timeDuration = {
    fromTime: data?.fromTime,
    tillTime: data?.tillTime,
  };

  const availabalitySlots = calculateDate(
    formattedDate,
    timeDuration,
    nylasCalendar,
    duration
  );

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>

      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {availabalitySlots.length > 0 ? (
          availabalitySlots.map((slot, index) => (
            <Link
              key={index}
              href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`}
            >
              <Button className="w-full mb-2" variant="outline">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>Tidak ada waktu yang tersedia untuk hari ini!</p>
        )}
      </div>
    </div>
  );
}

export default TimeTable;
