import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconCircle, IconCrown, IconEqual, IconRobot, IconX } from "@tabler/icons-react";
import Square from "./Square";
import { cn } from "../lib/utils";

interface BoardProps {
    mode: "1P" | "2P";
    playerXName: string;
    playerOName: string;
    onGameEnd: (result: "X" | "O" | "draw") => void;
    /** Reports whose turn it is so the scoreboard can light up the right card. */
    onTurnChange?: (side: "X" | "O") => void;
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

/**
 * Cell geometry. This mirrors the `h-[84px] w-[84px]` size in Square.tsx and
 * the `gap-2` of the grid below; the winning line is placed with the same
 * numbers, so the three must be changed together.
 */
const CELL_SIZE = 84;
const CELL_GAP = 8;
const BOARD_SPAN = CELL_SIZE * 3 + CELL_GAP * 2;

/** Centre of cell `index`, as a percentage of the board's inner box. */
function cellCenter(index: number) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
        x: ((col * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2) / BOARD_SPAN) * 100,
        y: ((row * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2) / BOARD_SPAN) * 100,
    };
}

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

/** Live "AI is thinking" badge shown inside the status region. */
function ThinkingDots() {
    return (
        <span className="ml-1 flex items-center gap-1.5 rounded-full border border-mark-o/25 bg-mark-o/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-mark-o/90">
            <IconRobot size={13} aria-hidden />
            thinking
            <span className="flex items-center gap-0.5">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="size-1 rounded-full bg-mark-o"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    />
                ))}
            </span>
        </span>
    );
}

/**
 * Strokes a line through the three winning cells. It is rendered over the grid
 * as a non-interactive SVG so the cells underneath stay clickable.
 */
function WinningLine({ line, symbol }: { line: number[]; symbol: "X" | "O" }) {
    const { x1, y1, x2, y2 } = useMemo(() => {
        const start = cellCenter(line[0]);
        const end = cellCenter(line[2]);
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.hypot(dx, dy) || 1;
        // Overshoot both ends by ~a third of a cell so the stroke spans the row.
        const over = ((CELL_SIZE / 2) * 0.62 * 100) / BOARD_SPAN;
        return {
            x1: start.x - (dx / length) * over,
            y1: start.y - (dy / length) * over,
            x2: end.x + (dx / length) * over,
            y2: end.y + (dy / length) * over,
        };
    }, [line]);

    const stroke = symbol === "X" ? "url(#win-line-x)" : "url(#win-line-o)";

    return (
        <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 size-full"
        >
            <defs>
                <linearGradient
                    id="win-line-x"
                    gradientUnits="userSpaceOnUse"
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                >
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient
                    id="win-line-o"
                    gradientUnits="userSpaceOnUse"
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                >
                    <stop offset="0%" stopColor="#fda4af" />
                    <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
            </defs>

            {/* Soft bloom pass */}
            <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={stroke}
                strokeWidth={3.2}
                strokeLinecap="round"
                opacity={0.35}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Crisp pass on top */}
            <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={stroke}
                strokeWidth={1}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />
        </svg>
    );
}

/** Coloured halo that blooms behind the board once the game is decided. */
function VictoryAura({ tone }: { tone: "X" | "O" | "draw" }) {
    return (
        <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "pointer-events-none absolute -inset-6 rounded-[2rem] blur-2xl",
                tone === "X" && "bg-mark-x/25",
                tone === "O" && "bg-mark-o/25",
                tone === "draw" && "bg-gold/15"
            )}
        />
    );
}

function Board({
    mode,
    playerXName,
    playerOName,
    onGameEnd,
    onTurnChange,
}: BoardProps) {
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

    // Tell the parent whose turn it is so the scoreboard can highlight that
    // card. React bails out when the value is unchanged, so re-runs are free.
    useEffect(() => {
        onTurnChange?.(isXNext ? "X" : "O");
    }, [isXNext, onTurnChange]);

    const currentPlayerName = isXNext ? playerXName : playerOName;
    const gameOver = Boolean(winner) || isDraw;
    const statusKey = winner
        ? `win-${winner}`
        : isDraw
          ? "draw"
          : isXNext
            ? "turn-x"
            : "turn-o";

    return (
        <div className="flex w-full flex-col items-center">
            <div
                role="status"
                aria-live="polite"
                className="mb-4 flex min-h-12 w-full items-center justify-center"
            >
                {/* popLayout mounts the incoming status immediately (the old one
                    fades out in place), so the turn read-out never lags behind
                    a completed exit animation. */}
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={statusKey}
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.1 }}
                        className={cn(
                            "status-pill",
                            winner && "status-pill--win",
                            isDraw && "status-pill--draw",
                            !gameOver &&
                                (isXNext ? "status-pill--x" : "status-pill--o")
                        )}
                    >
                        {winner && (
                            <span className="flex items-center gap-2 text-lg font-black tracking-tight text-mint sm:text-xl">
                                <IconCrown size={24} aria-hidden />
                                {winner === "X" ? playerXName : playerOName} ({winner}) wins!
                            </span>
                        )}

                        {isDraw && (
                            <span className="flex items-center gap-2 text-lg font-black tracking-tight text-gold sm:text-xl">
                                <IconEqual size={22} aria-hidden />
                                It&apos;s a draw!
                            </span>
                        )}

                        {!gameOver && (
                            <div className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                                <span
                                    className={cn(
                                        "flex size-6 items-center justify-center rounded-lg ring-1",
                                        isXNext
                                            ? "bg-mark-x/15 text-mark-x ring-mark-x/30"
                                            : "bg-mark-o/15 text-mark-o ring-mark-o/30"
                                    )}
                                >
                                    {isXNext ? (
                                        <IconX size={15} stroke={3.4} aria-hidden />
                                    ) : (
                                        <IconCircle size={14} stroke={3.4} aria-hidden />
                                    )}
                                </span>
                                <span className="text-white/45">
                                    Current Turn:
                                </span>
                                <span
                                    className={cn(
                                        "font-bold",
                                        isXNext ? "text-mark-x" : "text-mark-o"
                                    )}
                                >
                                    {currentPlayerName} ({isXNext ? "X" : "O"})
                                </span>
                                {mode === "1P" && !isXNext && <ThinkingDots />}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative mx-auto w-fit">
                {gameOver && <VictoryAura tone={winner ?? "draw"} />}

                <motion.div
                    role="group"
                    aria-label="Game board"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="board-bezel"
                >
                    <div className="relative">
                        <div className="grid grid-cols-3 gap-2">
                            {squares.map((_, index) => {
                                const row = Math.floor(index / 3);
                                const col = index % 3;
                                const value = squares[index];
                                const isWinSquare =
                                    winningLine?.includes(index) ?? false;
                                const isPlayable =
                                    !gameOver &&
                                    !value &&
                                    !(mode === "1P" && !isXNext);

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={
                                            isWinSquare
                                                ? {
                                                      opacity: 1,
                                                      scale: [1, 1.05, 1],
                                                  }
                                                : { opacity: 1, scale: 1 }
                                        }
                                        transition={
                                            isWinSquare
                                                ? {
                                                      duration: 1.4,
                                                      repeat: Infinity,
                                                      ease: "easeInOut",
                                                  }
                                                : {
                                                      delay: index * 0.03,
                                                      type: "spring",
                                                      stiffness: 280,
                                                      damping: 22,
                                                  }
                                        }
                                    >
                                        <Square
                                            value={value}
                                            onClick={() => handleClick(index)}
                                            disabled={!isPlayable}
                                            label={`Row ${row + 1}, column ${col + 1}, ${value ?? "empty"}`}
                                            className={cn(
                                                isWinSquare && "cell--win",
                                                isPlayable && "cell--playable",
                                                !value && "cell--empty",
                                                !isPlayable &&
                                                    !value &&
                                                    "cursor-not-allowed"
                                            )}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>

                        {winningLine && winner && (
                            <WinningLine line={winningLine} symbol={winner} />
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Board;




