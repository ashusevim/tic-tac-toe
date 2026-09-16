import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconCircle, IconEqual, IconX } from "@tabler/icons-react";
import { cn } from "../lib/utils";

interface ScoreboardProps {
    playerXName: string;
    playerOName: string;
    scores: {
        x: number;
        o: number;
        draws: number;
    };
}

interface ScoreCardProps {
    label: string;
    value: number;
    icon: ReactNode;
    className?: string;
}

function ScoreCard({ label, value, icon, className }: ScoreCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center gap-1 rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2",
                className
            )}
        >
            <span className="flex w-full items-center justify-center gap-1 text-xs uppercase tracking-wide text-gray-400">
                {icon}
                <span className="truncate">{label}</span>
            </span>
            <span className="relative inline-flex h-8 items-center justify-center">
                <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: -12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="text-2xl font-bold tabular-nums"
                    >
                        {value}
                    </motion.span>
                </AnimatePresence>
            </span>
        </div>
    );
}

function Scoreboard({ playerXName, playerOName, scores }: ScoreboardProps) {
    return (
        <div className="mb-4 grid w-full max-w-md grid-cols-3 gap-2 font-mono">
            <ScoreCard
                label={`${playerXName} (X)`}
                value={scores.x}
                icon={<IconX size={14} stroke={3} aria-hidden />}
                className="text-blue-400"
            />
            <ScoreCard
                label="Draws"
                value={scores.draws}
                icon={<IconEqual size={14} aria-hidden />}
                className="text-gray-300"
            />
            <ScoreCard
                label={`${playerOName} (O)`}
                value={scores.o}
                icon={<IconCircle size={13} stroke={3} aria-hidden />}
                className="text-red-400"
            />
        </div>
    );
}

export default Scoreboard;
