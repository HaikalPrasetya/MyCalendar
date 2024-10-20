import { IsEmptyDataPage } from "@/components/IsEmptyDataPage";
import SubmitButton from "@/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CancelBooking } from "@/utils/actions";
import { requiredUser } from "@/utils/hook";
import { nylas } from "@/utils/nylas";
import { prisma } from "@/utils/prisma";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";

const getData = async (userId: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const data = await nylas.events.list({
    identifier: userData.grantId as string,
    queryParams: {
      calendarId: userData.grantEmail as string,
    },
  });

  return data;
};

async function MeetingsPage() {
  const session = await requiredUser();

  const data = await getData(session?.id!);

  return (
    <>
      {data.data.length < 1 ? (
        <IsEmptyDataPage
          title="No meetings found"
          description="You dont have any meeting yet."
          buttonText="Create a new event type"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>See upcoming event</CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((item) => (
              <form key={item.id} action={CancelBooking}>
                <input type="hidden" name="eventId" value={item.id} />
                <div
                  key={item.id}
                  className="grid grid-cols-3 justify-between items-center"
                >
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {format(
                        fromUnixTime(item.when.startTime),
                        "EEEE, dd MMM"
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs pt-1">
                      {format(fromUnixTime(item.when.startTime), "hh:mm a")} -{" "}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>

                    <div className="flex items-center mt-1">
                      <Video className="size-4 mr-2 text-primary" />

                      <a
                        className="text-xs text-primary underline underline-offset-4"
                        href={item.conferencing.details.url}
                        target="_blank"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      You and {item.participants[0].name}
                    </p>
                  </div>

                  <SubmitButton
                    text="Cancel Event"
                    variant="destructive"
                    className="w-fit flex ml-auto"
                  />
                </div>
                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default MeetingsPage;
