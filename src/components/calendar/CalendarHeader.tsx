import { type CalendarState } from "react-stately";
import { FocusableElement, DOMAttributes } from "@react-types/shared";
import { type AriaButtonProps } from "@react-aria/button";
import { useDateFormatter } from "@react-aria/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarButton from "./CalendarButton";
import { VisuallyHidden } from "react-aria";

type Props = {
  state: CalendarState;
  prevButtonProps: AriaButtonProps<"button">;
  nextButtonProps: AriaButtonProps<"button">;
  calendarProps: DOMAttributes<FocusableElement>;
};

function CalendarHeader({
  calendarProps,
  nextButtonProps,
  prevButtonProps,
  state,
}: Props) {
  const monthDateFormatter = useDateFormatter({
    year: "numeric",
    month: "short",
    timeZone: state.timeZone,
  });

  const [month, _, year] = monthDateFormatter
    .formatToParts(state.visibleRange.start.toDate(state.timeZone))
    .map((data) => data.value);

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-1 text-md">
        <h5 className="font-semibold">{month}</h5>
        <span className="text-muted-foreground">{year}</span>
      </div>
      <div className="flex items-center gap-2">
        <CalendarButton {...prevButtonProps}>
          <ChevronLeft />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRight />
        </CalendarButton>
      </div>
    </div>
  );
}

export default CalendarHeader;
