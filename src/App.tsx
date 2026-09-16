import { useCallback, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
    IconArrowLeft,
    IconDeviceGamepad2,
    IconPlayerPlayFilled,
    IconRefresh,
    IconRobot,
    IconUser,
    IconUsers,
} from "@tabler/icons-react";
import "./App.css";
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
    "w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 transition-colors focus:border-blue-400 focus:outline-none";

const SCREEN_MOTION = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.22 },
};

function App() {
    const [screen, setScreen] = useState<Screen>("menu");
    const [mode, setMode] = useState<GameMode>("1P");
    const [playerXName, setPlayerXName] = useState("Player 1");
    const [playerOName, setPlayerOName] = useState("Player 2");
    const [gameKey, setGameKey] = useState(0);
    const [scores, setScores] = useState<Scores>({ x: 0, o: 0, draws: 0 });

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
    };

    const handleBackToMenu = () => {
        setScreen("menu");
        setGameKey(0);
        setScores({ x: 0, o: 0, draws: 0 });
    };

    const handleGameEnd = useCallback((result: "X" | "O" | "draw") => {
        setScores((prev) => {
            if (result === "X") return { ...prev, x: prev.x + 1 };
            if (result === "O") return { ...prev, o: prev.o + 1 };
            return { ...prev, draws: prev.draws + 1 };
        });
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <div className="pb-6">
                <header className="m-2 flex items-center justify-center gap-3">
                    <IconDeviceGamepad2 size={32} className="text-blue-400" aria-hidden />
                    <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
                </header>

                <AnimatePresence mode="wait">
                    {screen === "menu" ? (
                        <motion.div
                            key="menu"
                            {...SCREEN_MOTION}
                            className="mt-6 flex flex-col items-center gap-4"
                        >
                            {/* Mode selection */}
                            <div className="flex gap-4">
                                <Button
                                    variant="neutral"
                                    toggle
                                    selected={mode === "1P"}
                                    onClick={() => setMode("1P")}
                                >
                                    <IconRobot size={18} aria-hidden />
                                    1 Player (vs AI)
                                </Button>
                                <Button
                                    variant="neutral"
                                    toggle
                                    selected={mode === "2P"}
                                    onClick={() => setMode("2P")}
                                >
                                    <IconUsers size={18} aria-hidden />
                                    2 Players
                                </Button>
                            </div>

                            {/* Player name inputs */}
                            <div className="mt-4 flex w-64 flex-col">
                                <div>
                                    <label
                                        htmlFor="player-x-name"
                                        className="mb-1 flex items-center gap-1 text-sm text-gray-400"
                                    >
                                        <IconUser size={14} aria-hidden />
                                        Player X name
                                    </label>
                                    <input
                                        id="player-x-name"
                                        type="text"
                                        value={playerXName}
                                        onChange={(e) => setPlayerXName(e.target.value)}
                                        placeholder="Player 1"
                                        className={INPUT_CLASSES}
                                    />
                                </div>

                                <AnimatePresence initial={false}>
                                    {mode === "2P" && (
                                        <motion.div
                                            key="player-o-name"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-3">
                                                <label
                                                    htmlFor="player-o-name"
                                                    className="mb-1 flex items-center gap-1 text-sm text-gray-400"
                                                >
                                                    <IconUser size={14} aria-hidden />
                                                    Player O name
                                                </label>
                                                <input
                                                    id="player-o-name"
                                                    type="text"
                                                    value={playerOName}
                                                    onChange={(e) => setPlayerOName(e.target.value)}
                                                    placeholder="Player 2"
                                                    className={INPUT_CLASSES}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                className="mt-4"
                                onClick={handleStart}
                            >
                                <IconPlayerPlayFilled size={20} aria-hidden />
                                Start Game
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="playing"
                            {...SCREEN_MOTION}
                            className="mt-4 flex flex-col items-center"
                        >
                            <Scoreboard
                                playerXName={displayXName}
                                playerOName={displayOName}
                                scores={scores}
                            />

                            <Board
                                key={gameKey}
                                mode={mode}
                                playerXName={displayXName}
                                playerOName={displayOName}
                                onGameEnd={handleGameEnd}
                            />

                            <div className="mt-6 flex justify-center gap-4">
                                <Button variant="warning" onClick={handleReset}>
                                    <IconRefresh size={18} aria-hidden />
                                    New Round
                                </Button>
                                <Button variant="danger" onClick={handleBackToMenu}>
                                    <IconArrowLeft size={18} aria-hidden />
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
