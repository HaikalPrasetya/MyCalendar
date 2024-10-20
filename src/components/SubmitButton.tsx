"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  text: string;
};

function SubmitButton({ className, variant, text }: Props) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled variant={"outline"} className={cn("w-fit", className)}>
          <Loader2 size="15" className="animate-spin" />
        </Button>
      ) : (
        <Button
          type="submit"
          variant={variant}
          className={cn("w-fit", className)}
        >
          {text}
        </Button>
      )}
    </>
  );
}

export default SubmitButton;
