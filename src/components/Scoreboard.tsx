import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconCircle, IconEqual, IconX } from "@tabler/icons-react";
import { cn } from "../lib/utils";

type Tone = "x" | "draw" | "o";

interface ScoreboardProps {
    playerXName: string;
    playerOName: string;
    scores: {
        x: number;
        o: number;
        draws: number;
    };
    /** Side currently on the clock; that card is highlighted until it changes. */
    activeSide?: "X" | "O" | null;
}

interface ScoreCardProps {
    label: string;
    value: number;
    icon: ReactNode;
    tone: Tone;
    active?: boolean;
}

const TONE_CARD: Record<Tone, string> = {
    x: "stat-card--x",
    draw: "stat-card--draw",
    o: "stat-card--o",
};

const TONE_TEXT: Record<Tone, string> = {
    x: "text-mark-x/90",
    draw: "text-white/55",
    o: "text-mark-o/90",
};

const TONE_VALUE: Record<Tone, string> = {
    x: "text-mark-x",
    draw: "text-white/85",
    o: "text-mark-o",
};

/**
 * The label sits above the value as its own box, so the two are always
 * separated by a line break in the rendered text.
 */
function ScoreCard({ label, value, icon, tone, active = false }: ScoreCardProps) {
    return (
        <div
            className={cn(
                "stat-card",
                TONE_CARD[tone],
                active && "stat-card--active"
            )}
        >
            <span
                className={cn(
                    "flex w-full items-center justify-center gap-1 text-[9px] font-semibold tracking-[0.1em] uppercase sm:text-[10px] sm:tracking-[0.14em]",
                    TONE_TEXT[tone]
                )}
            >
                {icon}
                <span className="truncate">{label}</span>
            </span>

            <span className="relative inline-flex h-9 items-center justify-center">
                <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: -14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 14, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className={cn(
                            "text-3xl leading-none font-black tabular-nums",
                            TONE_VALUE[tone]
                        )}
                    >
                        {value}
                    </motion.span>
                </AnimatePresence>
            </span>
        </div>
    );
}

function Scoreboard({
    playerXName,
    playerOName,
    scores,
    activeSide = null,
}: ScoreboardProps) {
    return (
        <div className="mb-4 grid w-full max-w-md grid-cols-3 gap-2">
            <ScoreCard
                label={`${playerXName} (X)`}
                value={scores.x}
                icon={<IconX size={13} stroke={3.2} aria-hidden />}
                tone="x"
                active={activeSide === "X"}
            />
            <ScoreCard
                label="Draws"
                value={scores.draws}
                icon={<IconEqual size={13} aria-hidden />}
                tone="draw"
            />
            <ScoreCard
                label={`${playerOName} (O)`}
                value={scores.o}
                icon={<IconCircle size={12} stroke={3.2} aria-hidden />}
                tone="o"
                active={activeSide === "O"}
            />
        </div>
    );
}

export default Scoreboard;
