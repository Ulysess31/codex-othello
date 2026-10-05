const BOARD_SIZE = 8;
const PLAYERS = ['black', 'white'];
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],            [0, 1],
  [1, -1],  [1, 0],   [1, 1],
];

function isOnBoard(row, col) {
  return Number.isInteger(row)
    && Number.isInteger(col)
    && row >= 0
    && row < BOARD_SIZE
    && col >= 0
    && col < BOARD_SIZE;
}

function getOpponent(player) {
  if (player === 'black') return 'white';
  if (player === 'white') return 'black';
  return null;
}

/** 오델로의 표준 중앙 배치로 새 보드를 만든다. */
export function createInitialBoard() {
  const board = Array.from(
    { length: BOARD_SIZE },
    () => Array(BOARD_SIZE).fill(null),
  );

  board[3][3] = 'white'; // D4
  board[3][4] = 'black'; // E4
  board[4][3] = 'black'; // D5
  board[4][4] = 'white'; // E5

  return board;
}

/** 해당 칸에 돌을 두었을 때 포위되어 뒤집힐 좌표를 찾는다. */
export function getFlips(board, row, col, player) {
  const opponent = getOpponent(player);
  if (!opponent || !isOnBoard(row, col) || board[row][col] !== null) {
    return [];
  }

  const allFlips = [];

  for (const [rowStep, colStep] of DIRECTIONS) {
    const line = [];
    let nextRow = row + rowStep;
    let nextCol = col + colStep;

    // 바로 이웃한 칸부터 상대 돌을 따라가며 임시 목록에 모은다.
    while (
      isOnBoard(nextRow, nextCol)
      && board[nextRow][nextCol] === opponent
    ) {
      line.push([nextRow, nextCol]);
      nextRow += rowStep;
      nextCol += colStep;
    }

    // 상대 돌 뒤에서 내 돌을 만난 방향만 포위가 완성된 것으로 인정한다.
    if (
      line.length > 0
      && isOnBoard(nextRow, nextCol)
      && board[nextRow][nextCol] === player
    ) {
      allFlips.push(...line);
    }
  }

  return allFlips;
}

/** 현재 플레이어가 합법적으로 둘 수 있는 빈 칸을 찾는다. */
export function getLegalMoves(board, player) {
  if (!PLAYERS.includes(player)) return [];

  const legalMoves = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (getFlips(board, row, col, player).length > 0) {
        legalMoves.push({ row, col });
      }
    }
  }

  return legalMoves;
}

/** 합법 수와 뒤집기를 반영한 새 보드를 반환한다. */
export function applyMove(board, row, col, player) {
  const flips = getFlips(board, row, col, player);
  if (flips.length === 0) return null;

  // React 화면이 이전 보드 상태를 안전하게 사용할 수 있도록 행까지 복사한다.
  const nextBoard = board.map((boardRow) => [...boardRow]);
  nextBoard[row][col] = player;

  for (const [flipRow, flipCol] of flips) {
    nextBoard[flipRow][flipCol] = player;
  }

  return nextBoard;
}

/** 방금 수를 둔 플레이어를 기준으로 다음 차례, 패스 또는 종료를 계산한다. */
export function getNextTurn(board, player) {
  const opponent = getOpponent(player);
  const opponentMoves = getLegalMoves(board, opponent);

  if (opponentMoves.length > 0) {
    return {
      currentPlayer: opponent,
      status: 'playing',
      passed: false,
      winner: null,
    };
  }

  // 상대가 둘 곳이 없으면 수를 둔 사람이 연속으로 한 번 더 둔다.
  const currentPlayerMoves = getLegalMoves(board, player);
  if (currentPlayerMoves.length > 0) {
    return {
      currentPlayer: player,
      status: 'playing',
      passed: true,
      winner: null,
    };
  }

  const score = countDiscs(board);
  let winner = null;
  if (score.black > score.white) winner = 'black';
  if (score.white > score.black) winner = 'white';

  return {
    currentPlayer: player,
    status: 'finished',
    passed: false,
    winner,
  };
}

/** 보드에서 흑과 백의 돌 개수를 다시 센다. */
export function countDiscs(board) {
  const score = { black: 0, white: 0 };

  for (const row of board) {
    for (const cell of row) {
      if (cell === 'black') score.black += 1;
      if (cell === 'white') score.white += 1;
    }
  }

  return score;
}
