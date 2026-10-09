const BOARD_SIZE = 8;

const ARROW_MOVES = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

// 방향키는 보드 바깥으로 나가지 않도록 가장자리에서 멈춘다.
export function getNextCellPosition(row, col, key) {
  const move = ARROW_MOVES[key];
  if (!move) return null;

  return {
    row: Math.max(0, Math.min(BOARD_SIZE - 1, row + move[0])),
    col: Math.max(0, Math.min(BOARD_SIZE - 1, col + move[1])),
  };
}
