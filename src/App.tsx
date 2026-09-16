import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
    IconArrowLeft,
    IconCircle,
    IconDeviceGamepad2,
    IconPlayerPlayFilled,
    IconRefresh,
    IconRobot,
    IconTarget,
    IconUser,
    IconUsers,
    IconX,
} from "@tabler/icons-react";
import Backdrop from "./components/Backdrop";
import Board from "./components/Board";
import Button from "./components/Button";
import Scoreboard from "./components/Scoreboard";

type GameMode = "1P" | "2P";
type Screen = "menu" | "playing";

interface Scores {
    x: number;
    o: number;
    draws: number;
}

const INPUT_CLASSES =
    "w-full rounded-xl border border-hairline bg-black/30 px-3.5 py-2.5 text-sm font-medium text-white placeholder-white/25 transition-colors focus:border-indigo-400/60 focus:bg-black/45 focus:outline-none";

const SCREEN_MOTION = {
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -12, scale: 0.98 },
    transition: { duration: 0.22, ease: "easeOut" as const },
};

/** Small uppercase read-out used for the HUD status chips. */
function Chip({ children }: { children: ReactNode }) {
    return (
        <span className="flex items-center gap-1.5 rounded-full border border-hairline bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            {children}
        </span>
    );
}

function App() {
    const [screen, setScreen] = useState<Screen>("menu");
    const [mode, setMode] = useState<GameMode>("1P");
    const [playerXName, setPlayerXName] = useState("Player 1");
    const [playerOName, setPlayerOName] = useState("Player 2");
    const [gameKey, setGameKey] = useState(0);
    const [scores, setScores] = useState<Scores>({ x: 0, o: 0, draws: 0 });
    const [activeSide, setActiveSide] = useState<"X" | "O" | null>("X");

    // Names shown during play. These are derived instead of written back into
    // the form state in handleStart, otherwise starting a 1P game would leave
    // "AI" in the Player O field after switching back to 2 Players.
    const displayXName = playerXName.trim() || "Player 1";
    const displayOName = mode === "1P" ? "AI" : playerOName.trim() || "Player 2";

    const handleStart = () => {
        setScreen("playing");
    };

    const handleReset = () => {
        setGameKey((prev) => prev + 1);
        setActiveSide("X");
    };

    const handleBackToMenu = () => {
        setScreen("menu");
        setGameKey(0);
        setScores({ x: 0, o: 0, draws: 0 });
        setActiveSide("X");
    };

    const handleGameEnd = useCallback((result: "X" | "O" | "draw") => {
        setActiveSide(null);
        setScores((prev) => {
            if (result === "X") return { ...prev, x: prev.x + 1 };
            if (result === "O") return { ...prev, o: prev.o + 1 };
            return { ...prev, draws: prev.draws + 1 };
        });
    }, []);

    // Stable identity so Board's turn effect never re-runs for a new function.
    const handleTurnChange = useCallback((side: "X" | "O") => {
        setActiveSide(side);
    }, []);

    const roundsPlayed = scores.x + scores.o + scores.draws;

    return (
        <MotionConfig reducedMotion="user">
            <Backdrop />

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-3 py-10 sm:px-4">
                <header className="mb-7 flex flex-col items-center gap-3.5 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 18,
                        }}
                        className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-b from-indigo-500 to-violet-600 shadow-brand"
                    >
                        <IconDeviceGamepad2
                            size={30}
                            className="text-white"
                            aria-hidden
                        />
                    </motion.div>

                    <div>
                        <h1 className="text-gradient text-4xl font-black tracking-tight sm:text-5xl">
                            Tic Tac Toe
                        </h1>
                        <p className="mt-2 text-[11px] font-medium tracking-[0.32em] text-white/35 uppercase">
                            Three in a row wins
                        </p>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {screen === "menu" ? (
                        <motion.div
                            key="menu"
                            {...SCREEN_MOTION}
                            className="w-full max-w-md"
                        >
                            <div className="hud-panel hud-ring grain p-5 sm:p-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <IconTarget
                                        size={14}
                                        className="text-indigo-300"
                                        aria-hidden
                                    />
                                    <span className="micro-label">
                                        Game mode
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1.5 rounded-2xl border border-hairline bg-black/30 p-1.5 sm:flex-row">
                                    <Button
                                        variant="neutral"
                                        toggle
                                        selected={mode === "1P"}
                                        onClick={() => setMode("1P")}
                                        className="w-full sm:flex-1"
                                    >
                                        <IconRobot size={16} aria-hidden />
                                        1 Player (vs AI)
                                    </Button>
                                    <Button
                                        variant="neutral"
                                        toggle
                                        selected={mode === "2P"}
                                        onClick={() => setMode("2P")}
                                        className="w-full sm:flex-1"
                                    >
                                        <IconUsers size={16} aria-hidden />
                                        2 Players
                                    </Button>
                                </div>

                                <div className="mt-6 mb-3 flex items-center gap-2">
                                    <IconUser
                                        size={14}
                                        className="text-indigo-300"
                                        aria-hidden
                                    />
                                    <span className="micro-label">Players</span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label
                                        htmlFor="player-x-name"
                                        className="flex flex-col gap-1.5 text-left"
                                    >
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-white/45">
                                            <IconX
                                                size={12}
                                                stroke={3}
                                                className="text-mark-x"
                                                aria-hidden
                                            />
                                            Player X
                                        </span>
                                        <input
                                            id="player-x-name"
                                            type="text"
                                            value={playerXName}
                                            onChange={(e) =>
                                                setPlayerXName(e.target.value)
                                            }
                                            placeholder="Player 1"
                                            className={INPUT_CLASSES}
                                        />
                                    </label>

                                    <AnimatePresence initial={false}>
                                        {mode === "2P" && (
                                            <motion.div
                                                key="player-o-field"
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.18 }}
                                                className="overflow-hidden"
                                            >
                                                <label
                                                    htmlFor="player-o-name"
                                                    className="flex flex-col gap-1.5 pb-0.5 text-left"
                                                >
                                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white/45">
                                                        <IconCircle
                                                            size={11}
                                                            stroke={3}
                                                            className="text-mark-o"
                                                            aria-hidden
                                                        />
                                                        Player O
                                                    </span>
                                                    <input
                                                        id="player-o-name"
                                                        type="text"
                                                        value={playerOName}
                                                        onChange={(e) =>
                                                            setPlayerOName(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Player 2"
                                                        className={INPUT_CLASSES}
                                                    />
                                                </label>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="mt-6 w-full"
                                    onClick={handleStart}
                                >
                                    <IconPlayerPlayFilled
                                        size={18}
                                        aria-hidden
                                    />
                                    Start Game
                                </Button>
                            </div>

                            <p className="mt-4 text-center text-xs text-white/35">
                                {mode === "1P"
                                    ? "You play X. The AI plays O and never misses a win."
                                    : "Two players, one device. Pass it between turns."}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="playing"
                            {...SCREEN_MOTION}
                            className="flex w-full max-w-md flex-col items-center"
                        >
                            <div className="mb-3 flex w-full items-center justify-between">
                                <Chip>
                                    {mode === "1P" ? (
                                        <IconRobot size={12} aria-hidden />
                                    ) : (
                                        <IconUsers size={12} aria-hidden />
                                    )}
                                    {mode === "1P" ? "Solo vs AI" : "Local 2P"}
                                </Chip>
                                <Chip>
                                    <IconTarget size={12} aria-hidden />
                                    Round {roundsPlayed + 1}
                                </Chip>
                            </div>

                            <Scoreboard
                                playerXName={displayXName}
                                playerOName={displayOName}
                                scores={scores}
                                activeSide={activeSide}
                            />

                            <Board
                                key={gameKey}
                                mode={mode}
                                playerXName={displayXName}
                                playerOName={displayOName}
                                onGameEnd={handleGameEnd}
                                onTurnChange={handleTurnChange}
                            />

                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <Button variant="warning" onClick={handleReset}>
                                    <IconRefresh size={17} aria-hidden />
                                    New Round
                                </Button>
                                <Button
                                    variant="neutral"
                                    onClick={handleBackToMenu}
                                >
                                    <IconArrowLeft size={17} aria-hidden />
                                    Back to Menu
                                </Button>
                            </div>
                        </motion.div>

                    )}
                </AnimatePresence>
            </div>
        </MotionConfig>
    );
}

export default App;



