"use client";

import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EditEventAction, NewEventAction } from "@/utils/actions";
import { NewEventValidationSchema } from "@/utils/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

type VideoCallType = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

type Props = {
  id: string;
  title: string;
  url: string;
  description: string;
  duration: number;
  VcSoftware: string;
};

function EditEventCard({
  id,
  title,
  url,
  description,
  duration,
  VcSoftware,
}: Props) {
  const [videoCallProvider, setVideoCallProvider] = useState<VideoCallType>(
    VcSoftware as VideoCallType
  );

  const [lastResult, action] = useFormState(EditEventAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: NewEventValidationSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="w-sreen flex flex-1 items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Edit janji temu
          </CardTitle>
          <CardDescription>Edit janji temu anda disini!</CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
          <Input type="hidden" name="eventId" defaultValue={id} />
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-3">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={title}
              />
              <p className="text-red-500 text-md">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>URL</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  MyCalendar.com/
                </span>
                <Input
                  name={fields.url.name}
                  key={fields.url.key}
                  defaultValue={url}
                  className="rounded-l-none"
                  placeholder="Meeting 2"
                />
                <p className="text-red-500 text-md">{fields.url.errors}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={description}
              />
              <p className="text-red-500 text-md">
                {fields.description.errors}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={String(duration)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Minutes</SelectItem>
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="45">45 Minutes</SelectItem>
                  <SelectItem value="60">60 Minutes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-md">{fields.duration.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Video Call Providers</Label>
              <Input
                type="hidden"
                name={fields.videoCallProviders.name}
                key={fields.videoCallProviders.key}
                defaultValue={videoCallProvider}
              />
              <ButtonGroup className="gap-5">
                <Button
                  type="button"
                  onClick={() => setVideoCallProvider("Google Meet")}
                  variant={
                    videoCallProvider === "Google Meet" ? "outline" : "default"
                  }
                >
                  Google Meet
                </Button>
                <Button
                  type="button"
                  onClick={() => setVideoCallProvider("Zoom Meeting")}
                  variant={
                    videoCallProvider === "Zoom Meeting" ? "outline" : "default"
                  }
                >
                  Zoom Meeting
                </Button>
                <Button
                  type="button"
                  onClick={() => setVideoCallProvider("Microsoft Teams")}
                  variant={
                    videoCallProvider === "Microsoft Teams"
                      ? "outline"
                      : "default"
                  }
                >
                  Microsoft Teams
                </Button>
              </ButtonGroup>
              <p className="text-red-500 text-md">
                {fields.videoCallProviders.errors}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between">
              <Button asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <SubmitButton text="Buat event baru" />
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default EditEventCard;
