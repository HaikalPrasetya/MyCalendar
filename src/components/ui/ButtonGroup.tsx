import { Children, cloneElement, ReactElement } from "react";
import { ButtonProps } from "./button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children: ReactElement<ButtonProps>[];
};

export function ButtonGroup({ children, className }: Props) {
  const childrenCount = Children.count(children);

  return (
    <div className={cn("flex w-full", className)}>
      {children.map((child, index) => {
        const isFirstItem = index === 0;
        const isLastItem = index === childrenCount - 1;

        return cloneElement(child, {
          className: cn(
            {
              "rounded-l-none": !isFirstItem,
              "rounded-r-none": !isLastItem,
              "border-l-0": !isFirstItem,
            },
            child.props.className
          ),
        });
      })}
    </div>
  );
}
