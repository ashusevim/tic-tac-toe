import { useCallback, useEffect, useState } from "react";
import Square from "./Square";

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

    return (
        <div>
            {!winner && !isDraw && (
                <div className="mb-4 text-xl font-mono">
                    Current Turn:{" "}
                    <span className={isXNext ? "text-blue-400" : "text-red-400"}>
                        {currentPlayerName} ({isXNext ? "X" : "O"})
                    </span>
                    {mode === "1P" && !isXNext && (
                        <span className="ml-2 text-sm text-gray-400">thinking...</span>
                    )}
                </div>
            )}

            {winner && (
                <div className="mb-4 text-2xl font-bold text-green-400">
                    {winner === "X" ? playerXName : playerOName} ({winner}) wins!
                </div>
            )}

            {isDraw && (
                <div className="mb-4 text-2xl font-bold text-yellow-400">
                    It's a draw!
                </div>
            )}

            <div className="board flex flex-col content-center items-center">
                {Array.from({ length: 3 }, (_, row) => (
                    <div key={row} className="board-row flex gap-1">
                        {Array.from({ length: 3 }, (_, col) => {
                            const index = row * 3 + col;
                            const isWinSquare = winningLine?.includes(index);
                            const value = squares[index];

                            let colorClass = "";
                            if (value === "X") colorClass = "text-blue-400";
                            if (value === "O") colorClass = "text-red-400";

                            let bgClass = "hover:bg-gray-600";
                            if (isWinSquare) bgClass = "bg-green-900";

                            return (
                                <Square
                                    key={`${row}-${col}`}
                                    value={squares[index]}
                                    onClick={() => handleClick(index)}
                                    className={`w-20 h-20 text-2xl font-bold flex items-center justify-center border-2 border-gray-800 cursor-pointer transition-colors duration-200 ${colorClass} ${bgClass}`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Board;
