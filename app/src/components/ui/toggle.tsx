"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none transition-all duration-300 whitespace-nowrap backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "bg-white/20 dark:bg-black/10 hover:bg-white/30 dark:hover:bg-black/20 data-[state=on]:bg-accent/80 data-[state=on]:text-accent-foreground data-[state=on]:shadow-md",
        outline:
          "border border-border/50 bg-transparent hover:bg-accent/50 hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3 min-w-10 rounded-xl",
        sm: "h-9 px-2.5 min-w-9 rounded-lg",
        lg: "h-11 px-4 min-w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
