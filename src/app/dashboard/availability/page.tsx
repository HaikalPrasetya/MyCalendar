import SubmitButton from "@/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AvailabilityAction } from "@/utils/actions";
import { requiredUser } from "@/utils/hook";
import { hours } from "@/utils/hours";
import { prisma } from "@/utils/prisma";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      availability: {
        select: {
          id: true,
          day: true,
          fromTime: true,
          tillTime: true,
          isActive: true,
        },
      },
    },
  });

  return data;
}

async function AvailabilityPage() {
  const session = await requiredUser();

  const availabilityData = await getData(session?.id!);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Availability</CardTitle>
        <CardDescription>Set your availability here!</CardDescription>
      </CardHeader>
      <form action={AvailabilityAction}>
        <CardContent className="grid gap-y-5">
          {availabilityData?.availability.map((data) => (
            <div key={data.id} className="grid grid-cols-[350px_1fr]">
              <input type="hidden" name={`id-${data.id}`} />
              <div className="flex gap-4">
                <Switch
                  name={`isActive-${data.id}`}
                  defaultChecked={data.isActive}
                />
                <span>{data.day}</span>
              </div>
              <div className="flex gap-4">
                <Select
                  name={`fromTime-${data.id}`}
                  defaultValue={data.fromTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={data.fromTime} />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem value={hour.time} key={hour.id}>
                        {hour.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  name={`tillTime-${data.id}`}
                  defaultValue={data.tillTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={data.tillTime} />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem value={hour.time} key={hour.id}>
                        {hour.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <SubmitButton text="Simpan Perubahan" />
        </CardFooter>
      </form>
    </Card>
  );
}

export default AvailabilityPage;
