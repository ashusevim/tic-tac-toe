import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

type ButtonVariant = "primary" | "warning" | "danger" | "neutral";
type ButtonSize = "md" | "lg";

/**
 * Shared layout id for the active pill in a toggle group. Motion animates the
 * pill between the buttons that reuse this id, so the selected mode slides
 * across instead of cross-fading.
 */
const TOGGLE_PILL_ID = "toggle-pill";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:
        "bg-gradient-to-b from-indigo-500 to-violet-600 text-white shadow-brand hover:from-indigo-400 hover:to-violet-500",
    warning:
        "bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 shadow-[0_16px_40px_-16px_rgb(251_191_36/0.85)] hover:from-amber-200 hover:to-amber-400",
    danger:
        "bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[0_16px_40px_-16px_rgb(244_63_94/0.85)] hover:from-rose-400 hover:to-rose-500",
    neutral:
        "border-hairline bg-white/[0.04] text-white/75 hover:bg-white/[0.09] hover:text-white",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    md: "px-4 py-2 text-sm",
    lg: "px-7 py-3.5 text-base",
};

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Marks this button as an on/off button and exposes its state to screen readers. */
    toggle?: boolean;
    /** Highlights the button as the active choice (used by the 1P / 2P selector). */
    selected?: boolean;
    disabled?: boolean;
    className?: string;
}

function Button({
    children,
    onClick,
    variant = "primary",
    size = "md",
    toggle = false,
    selected = false,
    disabled = false,
    className,
}: ButtonProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={toggle ? selected : undefined}
            whileHover={disabled ? undefined : { scale: 1.02 }}
            whileTap={disabled ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className={cn(
                "group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-transparent font-semibold tracking-tight transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:cursor-not-allowed disabled:opacity-50",
                VARIANT_CLASSES[variant],
                SIZE_CLASSES[size],
                selected && "text-white",
                className
            )}
        >
            {/* Sliding highlight for toggle groups */}
            {toggle && selected && (
                <motion.span
                    aria-hidden
                    layoutId={TOGGLE_PILL_ID}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-indigo-500 to-violet-600 shadow-brand"
                />
            )}

            {/* Light sweep on hover */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
            >
                <span className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%] motion-reduce:transition-none" />
            </span>

            <span className="relative z-10 inline-flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}

export default Button;
