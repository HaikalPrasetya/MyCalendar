import CopyLinkEvent from "@/components/CopyLinkEvent";
import EventSwitcher from "@/components/EventSwitcher";
import { IsEmptyDataPage } from "@/components/IsEmptyDataPage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { requiredUser } from "@/utils/hook";
import { prisma } from "@/utils/prisma";
import { ExternalLink, Pen, Settings, Trash, Users2 } from "lucide-react";
import Link from "next/link";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
      events: {
        select: {
          id: true,
          title: true,
          description: true,
          active: true,
          videoCallSoftware: true,
          duration: true,
          url: true,
        },
      },
    },
  });

  return data;
}

async function DashboardPage() {
  const session = await requiredUser();

  const data = await getData(session?.id!);

  return (
    <div>
      {data?.events.length === 0 ? (
        <IsEmptyDataPage
          buttonText="Tambah Event"
          href="/dashboard/new"
          title="Empty"
          description="Data is empty!"
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-4xl">Event</h1>
              <p className="text-muted-foreground text-md">
                Kamu dapat memanage event kamu disini!
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new">Buat event baru</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-5">
            {data?.events.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden shadow rounded-lg border relative"
              >
                <div className="absolute top-2 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Event</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href={`/${data.username}/${item.url}`}>
                            <ExternalLink className="mr-2 size-4" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <CopyLinkEvent
                          copyLinkUrl={`${process.env.BASE_URL}/${data.username}/${item.url}`}
                        />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/event/${item.id}`}>
                            <Pen className="size-4 mr-2" /> Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/event/${item.id}/delete`}>
                          <Trash className="size-4 mr-2" /> Delete
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link href="/" className="flex items-center p-5">
                  <div className="flex-shrink-0">
                    <Users2 className="size-6" />
                  </div>

                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {item.duration} Minutes Meetings
                      </dt>
                      <dd className="text-lg font-medium">{item.title}</dd>
                    </dl>
                  </div>
                </Link>
                <div className="bg-muted px-5 py-3 justify-between items-center flex">
                  <EventSwitcher active={item.active} eventId={item.id} />
                  <Button>Edit Event</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
