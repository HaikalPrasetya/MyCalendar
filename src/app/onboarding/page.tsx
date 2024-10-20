"use client";

import SubmitButton from "@/components/SubmitButton";
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
import { OnboardingAction } from "@/utils/actions";
import { useFormState } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { OnboardingValidationSchema } from "@/utils/zodSchemas";

function OnboardingPage() {
  const [lastResult, action] = useFormState(OnboardingAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: OnboardingValidationSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  console.log(lastResult);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Selamat Datang Di MyCalendar
          </CardTitle>
          <CardDescription>
            Kami perlu informasi tambahan untuk melengkapi profile anda🥹
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-2">
              <Label>Nama Lengkap</Label>
              <Input
                placeholder="Jonny"
                key={fields.fullName.key}
                name={fields.fullName.name}
                defaultValue={fields.fullName.initialValue}
              />
              <p className="text-red-500 text-md">{fields.fullName.errors}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Username</Label>
              <Input
                placeholder="Unique"
                key={fields.username.key}
                name={fields.username.name}
                defaultValue={fields.username.initialValue}
              />
              <p className="text-red-500 text-md">{fields.username.errors}</p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="Submit" className="w-full" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default OnboardingPage;
