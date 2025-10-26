import * as React from "react";

import { cn } from "./utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground backdrop-blur-md bg-white/40 dark:bg-black/20 border-border/50 flex h-11 w-full min-w-0 rounded-xl border px-4 py-2 text-base transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:bg-white/60 dark:focus-visible:bg-black/30",
          "aria-invalid:ring-destructive/30 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
