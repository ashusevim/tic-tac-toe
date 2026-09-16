import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    IconCircle,
    IconCrown,
    IconEqual,
    IconRobot,
    IconX,
} from "@tabler/icons-react";
import Square from "./Square";
import { cn } from "../lib/utils";

interface BoardProps {
    mode: "1P" | "2P";
    playerXName: string;
    playerOName: string;
    onGameEnd: (result: "X" | "O" | "draw") => void;
}

const WINNING_POSITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function getWinningLine(squares: (string | null)[]): number[] | null {
    for (const line of WINNING_POSITIONS) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return line;
        }
    }
    return null;
}

function minimax(
    squares: (string | null)[],
    isMaximizing: boolean,
    depth: number
): number {
    const winLine = getWinningLine(squares);
    if (winLine) {
        // If there's a winner, check who it is
        const winner = squares[winLine[0]];
        if (winner === "O") return 10 - depth; // AI wins (O)
        if (winner === "X") return depth - 10; // Player wins (X)
    }
    if (squares.every((s) => s !== null)) return 0; // Draw

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                squares[i] = "O";
                best = Math.max(best, minimax(squares, false, depth + 1));
                squares[i] = null;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!squares[i]) {
                squares[i] = "X";
                best = Math.min(best, minimax(squares, true, depth + 1));
                squares[i] = null;
            }
        }
        return best;
    }
}

function getBestMove(squares: (string | null)[]): number {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            squares[i] = "O";
            const score = minimax(squares, false, 0);
            squares[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function ThinkingDots() {
    return (
        <span className="ml-2 flex items-center gap-1 text-sm text-gray-400">
            <IconRobot size={16} aria-hidden />
            thinking
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="size-1 rounded-full bg-gray-400"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
            ))}
        </span>
    );
}

function Board({ mode, playerXName, playerOName, onGameEnd }: BoardProps) {
    const [squares, setSquares] = useState<(string | null)[]>(
        Array(9).fill(null)
    );
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<"X" | "O" | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const handleClick = useCallback(
        (index: number) => {
            if (winner || isDraw) return;
            if (squares[index]) return;
            // In 1P mode, block clicks when it's AI's turn (O)
            if (mode === "1P" && !isXNext) return;

            const newSquares = [...squares];
            newSquares[index] = isXNext ? "X" : "O";

            // Check for winner synchronously
            const line = getWinningLine(newSquares);
            if (line) {
                const winnerSymbol = newSquares[line[0]] as "X" | "O";
                setSquares(newSquares);
                setWinner(winnerSymbol);
                setWinningLine(line);
                return;
            }

            // Check for draw
            if (newSquares.every((s) => s !== null)) {
                setSquares(newSquares);
                setIsDraw(true);
                return;
            }

            setSquares(newSquares);
            setIsXNext(!isXNext);
        },
        [squares, isXNext, winner, isDraw, mode]
    );

    // AI move effect
    useEffect(() => {
        if (mode === "1P" && !isXNext && !winner && !isDraw) {
            const timeout = setTimeout(() => {
                const newSquares = [...squares];
                const move = getBestMove(newSquares);
                if (move === -1) return;

                newSquares[move] = "O";

                const line = getWinningLine(newSquares);
                if (line) {
                    setSquares(newSquares);
                    setWinner("O");
                    setWinningLine(line);
                    return;
                }

                if (newSquares.every((s) => s !== null)) {
                    setSquares(newSquares);
                    setIsDraw(true);
                    return;
                }

                setSquares(newSquares);
                setIsXNext(true);
            }, 400); // Small delay so the AI feels natural
            return () => clearTimeout(timeout);
        }
    }, [isXNext, mode, winner, isDraw, squares]);

    // Notify parent when game ends
    useEffect(() => {
        if (!gameEnded && (winner || isDraw)) {
            setGameEnded(true);
            if (winner) {
                onGameEnd(winner);
            } else {
                onGameEnd("draw");
            }
        }
    }, [winner, isDraw, gameEnded, onGameEnd]);

    const currentPlayerName = isXNext ? playerXName : playerOName;
    const gameOver = Boolean(winner) || isDraw;
    const statusKey = winner ? `win-${winner}` : isDraw ? "draw" : isXNext ? "turn-x" : "turn-o";

    return (
        <div>
            <div
                role="status"
                aria-live="polite"
                className="mb-4 flex min-h-10 items-center justify-center"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={statusKey}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                    >
                        {winner && (
                            <span className="flex items-center gap-2 text-2xl font-bold text-green-400">
                                <IconCrown size={28} aria-hidden />
                                {winner === "X" ? playerXName : playerOName} ({winner}) wins!
                            </span>
                        )}

                        {isDraw && (
                            <span className="flex items-center gap-2 text-2xl font-bold text-yellow-400">
                                <IconEqual size={26} aria-hidden />
                                It&apos;s a draw!
                            </span>
                        )}

                        {!gameOver && (
                            <div className="flex items-center gap-2 text-xl font-mono">
                                {isXNext ? (
                                    <IconX size={20} stroke={3} className="text-blue-400" aria-hidden />
                                ) : (
                                    <IconCircle size={18} stroke={3} className="text-red-400" aria-hidden />
                                )}
                                Current Turn:{" "}
                                <span className={isXNext ? "text-blue-400" : "text-red-400"}>
                                    {currentPlayerName} ({isXNext ? "X" : "O"})
                                </span>
                                {mode === "1P" && !isXNext && <ThinkingDots />}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.div
                role="group"
                aria-label="Game board"
                className="board mx-auto grid w-fit grid-cols-3 gap-1 rounded-xl border border-gray-800 bg-black/40 p-2 shadow-lg"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                {squares.map((_, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const value = squares[index];
                    const isWinSquare = winningLine?.includes(index) ?? false;
                    const isPlayable =
                        !gameOver && !value && !(mode === "1P" && !isXNext);

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={
                                isWinSquare
                                    ? { opacity: 1, scale: [1, 1.08, 1] }
                                    : { opacity: 1, scale: 1 }
                            }
                            transition={
                                isWinSquare
                                    ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
                                    : { delay: index * 0.03, type: "spring", stiffness: 260, damping: 20 }
                            }
                        >
                            <Square
                                value={value}
                                onClick={() => handleClick(index)}
                                disabled={!isPlayable}
                                label={`Row ${row + 1}, column ${col + 1}${value ? `, ${value}` : ", empty"}`}
                                className={cn(
                                    "h-20 w-20 rounded-md border-2 border-gray-800 bg-gray-900 text-2xl font-bold transition-colors duration-200",
                                    value === "X" && "text-blue-400",
                                    value === "O" && "text-red-400",
                                    isWinSquare && "border-green-500 bg-green-900",
                                    isPlayable && "cursor-pointer hover:bg-gray-600",
                                    !isPlayable && !value && "cursor-not-allowed",
                                    value && !isWinSquare && "cursor-default"
                                )}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}

export default Board;
