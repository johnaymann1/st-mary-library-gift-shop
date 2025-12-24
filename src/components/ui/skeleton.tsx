import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-neutral-200/60 dark:bg-neutral-700/50", className)}
      {...props}
    />
  )
}

export { Skeleton }
