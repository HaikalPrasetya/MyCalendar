import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AlmostGif from "../../../../public/almost.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarX2 } from "lucide-react";
import Link from "next/link";

function GrantIdPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Hampir selesai!😍😍😍
          </CardTitle>
          <CardDescription>Koneksi ke MyCalendar🚀🚀</CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src={AlmostGif}
            alt="Almost Gif"
            width={20}
            height={20}
            className="w-full h-full rounded-md"
          />
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/api/auth" className="w-full bg-primary">
              <CalendarX2 className="mr-2" />
              Disini
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default GrantIdPage;
