import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

type ButtonVariant = "primary" | "warning" | "danger" | "neutral";
type ButtonSize = "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: "border-green-500 bg-green-600 hover:bg-green-700",
    warning: "border-yellow-500 bg-yellow-600 hover:bg-yellow-700",
    danger: "border-red-500 bg-red-600 hover:bg-red-700",
    neutral: "border-gray-600 bg-gray-800 hover:bg-gray-700",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    md: "gap-2 px-4 py-2 text-base",
    lg: "gap-2 px-6 py-3 text-xl",
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
            whileHover={disabled ? undefined : { scale: 1.04 }}
            whileTap={disabled ? undefined : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={cn(
                "inline-flex items-center justify-center rounded-md border-2 font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-60",
                VARIANT_CLASSES[variant],
                SIZE_CLASSES[size],
                selected && "border-blue-400 bg-blue-900 ring-2 ring-blue-400/60",
                className
            )}
        >
            {children}
        </motion.button>
    );
}

export default Button;
