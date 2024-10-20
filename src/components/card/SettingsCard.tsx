"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { X } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadThing";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { SettingsAction } from "@/utils/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { SettingsValidationSchema } from "@/utils/zodSchemas";
import SubmitButton from "../SubmitButton";

type Props = {
  name: string;
  email: string;
  image: string;
};

function SettingsCard({ email, image, name }: Props) {
  const [imageUrl, setImageUrl] = useState(image);

  const [lastResult, action] = useFormState(SettingsAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: SettingsValidationSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleRemoveImageUrl = () => {
    setImageUrl("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage akun kamu disini!</CardDescription>
      </CardHeader>
      <form id={form.id} onSubmit={form.onSubmit} action={action}>
        <CardContent className="grid gap-y-3">
          <div className="flex flex-col gap-y-2">
            <Label>Full Name</Label>
            <Input
              name={fields.fullName.name}
              key={fields.fullName.key}
              defaultValue={fields.fullName.value}
              placeholder={name}
            />
            <p className="text-red-500 text-md">{fields.fullName.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input disabled placeholder={email} />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Profile Image</Label>
            <Input
              type="hidden"
              name={fields.imageUrl.name}
              key={fields.imageUrl.key}
              defaultValue={imageUrl}
            />
            {imageUrl ? (
              <div className="relative w-fit">
                <img
                  src={imageUrl}
                  alt="Profile Image"
                  className="w-14 h-14 rounded-md relative"
                />
                <div className="absolute top-0 right-0 bg-red-500 rounded-full">
                  <X
                    className="cursor-pointer"
                    onClick={handleRemoveImageUrl}
                  />
                </div>
              </div>
            ) : (
              <>
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url);
                    toast.success("Image berhasil di upload!");
                  }}
                />
              </>
            )}
            <p className="text-red-500 text-md">{fields.imageUrl.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Update" className="w-full" />
        </CardFooter>
      </form>
    </Card>
  );
}

export default SettingsCard;
