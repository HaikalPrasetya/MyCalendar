"use client";

import { useTransition } from "react";
import { Switch } from "./ui/switch";
import { ChangeStatusEvent } from "@/utils/actions";

type Props = {
  active: boolean;
  eventId: string;
};

function EventSwitcher({ active, eventId }: Props) {
  const [isPending, startTransation] = useTransition();

  return (
    <Switch
      disabled={isPending}
      defaultChecked={active}
      onCheckedChange={(checked) => {
        startTransation(() => {
          ChangeStatusEvent({ eventId, checked });
        });
      }}
    />
  );
}

export default EventSwitcher;
