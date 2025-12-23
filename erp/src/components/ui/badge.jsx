import React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = (variant) => {
    const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

    const variants = {
        default: "border-transparent bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-slate-950",
        success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        warning: "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200",
        neutral: "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200",
    }

    return cn(base, variants[variant || "default"])
}

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
    return (
        <div className={cn(badgeVariants(variant), className)} ref={ref} {...props} />
    )
})
Badge.displayName = "Badge"

export { Badge, badgeVariants }
