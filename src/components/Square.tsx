import { AnimatePresence, motion } from "motion/react";
import { IconCircle, IconX } from "@tabler/icons-react";
import { cn } from "../lib/utils";

interface SquareProps {
    value: string | null;
    onClick: () => void;
    /** Accessible name for the cell, e.g. "Row 1, column 2, X". */
    label: string;
    disabled?: boolean;
    className?: string;
}

/**
 * One cell of the 3x3 grid. Sizing lives here and is mirrored by `CELL_SIZE` /
 * `CELL_GAP` in Board.tsx, which use the same numbers to place the winning
 * line, so keep the two in sync.
 */
const Square = ({
    value,
    onClick,
    label,
    disabled = false,
    className,
}: SquareProps) => {
    return (
        <motion.button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            whileHover={disabled ? undefined : { scale: 1.04 }}
            whileTap={disabled ? undefined : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className={cn(
                "cell h-[84px] w-[84px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70",
                className
            )}
        >
            <AnimatePresence initial={false}>
                {value && (
                    <motion.span
                        key={value}
                        initial={{ scale: 0.4, opacity: 0, rotate: -35 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 18,
                        }}
                        className="pointer-events-none flex items-center justify-center"
                    >
                        {value === "X" ? (
                            <IconX
                                size={46}
                                stroke={3.2}
                                aria-hidden
                                className="text-mark-x drop-shadow-[0_0_12px_rgb(34_211_238/0.75)]"
                            />
                        ) : (
                            <IconCircle
                                size={40}
                                stroke={3.2}
                                aria-hidden
                                className="text-mark-o drop-shadow-[0_0_12px_rgb(251_113_133/0.75)]"
                            />
                        )}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

export default Square;
