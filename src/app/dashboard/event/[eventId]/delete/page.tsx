import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DeleteEventAction } from "@/utils/actions";
import Link from "next/link";

function DeleteEventPage({ params }: { params: { eventId: string } }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Delete Event ini?
          </CardTitle>
          <CardDescription>Yakin?</CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex justify-between items-center w-full">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Kembali</Link>
            </Button>
            <form action={DeleteEventAction}>
              <Input type="hidden" name="id" defaultValue={params.eventId} />
              <SubmitButton text="Hapus" variant="destructive" />
            </form>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DeleteEventPage;
