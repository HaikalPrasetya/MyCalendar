import { useRef } from "react";
import { useCalendarCell, useFocusRing, mergeProps } from "react-aria";
import { CalendarState } from "react-stately";
import { CalendarDate, isToday, isSameMonth } from "@internationalized/date";
import { cn } from "@/lib/utils";

function CalendarCell({
  state,
  date,
  currentMonth,
  isDateUnavailable,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  isDateUnavailable: boolean;
}) {
  let ref = useRef(null);
  let { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  const isOutsideMonth = !isSameMonth(currentMonth, date);
  const { focusProps, isFocusVisible } = useFocusRing();
  const currentDateIsToday = isToday(date, state.timeZone);
  const finalDisabled = isDateUnavailable || isDisabled;

  return (
    <td
      {...cellProps}
      className={`py-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className={`w-10 h-10 outline-none group`}
      >
        <div
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center relative",
            isSelected ? "bg-primary text-black" : "",
            finalDisabled ? "cursor-not-allowed text-muted-foreground" : "",
            !finalDisabled && !isSelected ? "bg-secondary" : ""
          )}
        >
          {formattedDate}
          {currentDateIsToday && (
            <div
              className={cn(
                "size-2 rounded-full absolute bottom-1 bg-slate-200",
                isSelected ? "bg-black" : ""
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}

export default CalendarCell;
