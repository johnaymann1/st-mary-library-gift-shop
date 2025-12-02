import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
        success:
          "bg-green-100 text-green-800 border border-green-200",
        warning:
          "bg-yellow-100 text-yellow-800 border border-yellow-200",
        destructive:
          "bg-red-100 text-red-800 border border-red-200",
        outline: 
          "border border-neutral-200 text-neutral-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
