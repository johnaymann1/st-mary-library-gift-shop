'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleProps {
  id?: string
  name: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ id, name, checked, defaultChecked, onChange, label, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked
      setIsChecked(newValue)
      onChange?.(newValue)
    }

    const finalChecked = checked !== undefined ? checked : isChecked

    return (
      <div className="flex items-center gap-3">
        <label className={cn("relative inline-flex cursor-pointer items-center", disabled && "opacity-50 cursor-not-allowed")}>
          <input
            ref={ref}
            id={id}
            name={name}
            type="checkbox"
            className="peer sr-only"
            checked={finalChecked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />
          <div className={cn(
            "peer relative h-6 w-11 rounded-full bg-neutral-300 transition-colors duration-200 ease-in-out",
            "after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out after:shadow-md",
            "peer-checked:bg-rose-600 peer-checked:after:translate-x-5",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-rose-600 peer-focus-visible:ring-offset-2",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}></div>
        </label>
        {label && (
          <label htmlFor={id} className={cn("text-sm font-medium text-neutral-700", disabled && "opacity-50", !disabled && "cursor-pointer")}>
            {label}
          </label>
        )}
      </div>
    )
  }
)
Toggle.displayName = "Toggle"

export { Toggle }
