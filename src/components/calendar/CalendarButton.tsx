import { Button } from "../ui/button";
import { type AriaButtonProps, useButton } from "@react-aria/button";
import { useRef } from "react";

function CalendarButton(props: AriaButtonProps<"button">) {
  const buttonRef = useRef(null);
  const { buttonProps } = useButton(props, buttonRef);

  return (
    <Button {...buttonProps} ref={buttonRef} size={"icon"} variant={"outline"}>
      {props.children}
    </Button>
  );
}

export default CalendarButton;
