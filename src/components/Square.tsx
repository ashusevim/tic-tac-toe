import { IconCircle, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";

interface SquareProps {
    value: string | null;
    onClick: () => void;
    /** Accessible name for the cell, e.g. "Row 1, column 2, X". */
    label: string;
    disabled?: boolean;
    className?: string;
}

const Square = ({ value, onClick, label, disabled = false, className }: SquareProps) => {
    return (
        <motion.button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            whileHover={disabled ? undefined : { scale: 1.05 }}
            whileTap={disabled ? undefined : { scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={cn(
                "flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                className
            )}
        >
            <AnimatePresence initial={false}>
                {value && (
                    <motion.span
                        key={value}
                        initial={{ scale: 0.3, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 20 }}
                        className="pointer-events-none flex items-center justify-center"
                    >
                        {value === "X" ? (
                            <IconX size={40} stroke={3.5} aria-hidden />
                        ) : (
                            <IconCircle size={34} stroke={3.5} aria-hidden />
                        )}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default Square;
