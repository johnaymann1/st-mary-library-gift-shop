import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: 
          "text-white shadow-sm hover:opacity-90 active:scale-[0.98]",
        secondary: 
          "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 active:scale-[0.98]",
        ghost: 
          "hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.98]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.98]",
        outline:
          "border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 active:scale-[0.98]",
        link: 
          "underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Apply theme gradient/color for primary and link variants
    const themeStyle = variant === 'primary' 
      ? { background: 'var(--gradient-button)', ...style }
      : variant === 'link'
      ? { color: 'var(--primary)', ...style }
      : style;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={themeStyle}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
