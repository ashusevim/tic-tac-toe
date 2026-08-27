import { useCallback, useState } from "react";
import "./App.css";
import Board from "./components/Board";

type GameMode = "1P" | "2P";
type Screen = "menu" | "playing";

interface Scores {
    x: number;
    o: number;
    draws: number;
}

function App() {
    const [screen, setScreen] = useState<Screen>("menu");
    const [mode, setMode] = useState<GameMode>("1P");
    const [playerXName, setPlayerXName] = useState("Player 1");
    const [playerOName, setPlayerOName] = useState("Player 2");
    const [gameKey, setGameKey] = useState(0);
    const [scores, setScores] = useState<Scores>({ x: 0, o: 0, draws: 0 });

    const handleStart = () => {
        const finalOName = mode === "1P" ? "AI" : playerOName || "Player 2";
        const finalXName = playerXName || "Player 1";
        setPlayerXName(finalXName);
        setPlayerOName(finalOName);
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
        <div>
            <h1 className="text-3xl font-bold m-2">Tic Tac Toe</h1>

            {screen === "menu" && (
                <div className="mt-6 flex flex-col items-center gap-4">
                    {/* Mode selection */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode("1P")}
                            className={`px-5 py-2 rounded border-2 transition-colors ${
                                mode === "1P"
                                    ? "border-blue-400 bg-blue-900 text-white"
                                    : "border-gray-600 text-gray-300 hover:border-gray-400"
                            }`}
                        >
                            1 Player (vs AI)
                        </button>
                        <button
                            onClick={() => setMode("2P")}
                            className={`px-5 py-2 rounded border-2 transition-colors ${
                                mode === "2P"
                                    ? "border-blue-400 bg-blue-900 text-white"
                                    : "border-gray-600 text-gray-300 hover:border-gray-400"
                            }`}
                        >
                            2 Players
                        </button>
                    </div>

                    {/* Player name inputs */}
                    <div className="flex flex-col gap-3 mt-4 w-64">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Player X name
                            </label>
                            <input
                                type="text"
                                value={playerXName}
                                onChange={(e) => setPlayerXName(e.target.value)}
                                placeholder="Player 1"
                                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        {mode === "2P" && (
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Player O name
                                </label>
                                <input
                                    type="text"
                                    value={playerOName}
                                    onChange={(e) => setPlayerOName(e.target.value)}
                                    placeholder="Player 2"
                                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleStart}
                        className="mt-4 text-xl px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                        Start Game
                    </button>
                </div>
            )}

            {screen === "playing" && (
                <div className="mt-4">
                    {/* Scoreboard */}
                    <div className="flex justify-center gap-6 mb-4 text-sm font-mono">
                        <span className="text-blue-400">
                            {playerXName} (X): {scores.x}
                        </span>
                        <span className="text-gray-400">
                            Draws: {scores.draws}
                        </span>
                        <span className="text-red-400">
                            {playerOName} (O): {scores.o}
                        </span>
                    </div>

                    <Board
                        key={gameKey}
                        mode={mode}
                        playerXName={playerXName}
                        playerOName={playerOName}
                        onGameEnd={handleGameEnd}
                    />

                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={handleReset}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            New Round
                        </button>
                        <button
                            onClick={handleBackToMenu}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
