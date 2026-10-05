import { describe, expect, it } from 'vitest';
import {
  applyMove,
  countDiscs,
  createInitialBoard,
  getFlips,
  getLegalMoves,
  getNextTurn,
} from './othello.js';

function createEmptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

describe('createInitialBoard', () => {
  it('중앙에 정해진 시작 돌을 놓고 8×8 보드를 만든다', () => {
    const board = createInitialBoard();

    expect(board).toHaveLength(8);
    expect(board.every((row) => row.length === 8)).toBe(true);
    expect(board[3][3]).toBe('white'); // D4
    expect(board[3][4]).toBe('black'); // E4
    expect(board[4][3]).toBe('black'); // D5
    expect(board[4][4]).toBe('white'); // E5
    expect(countDiscs(board)).toEqual({ black: 2, white: 2 });
  });
});

describe('getFlips', () => {
  it('한 수로 여덟 방향의 상대 돌을 모두 찾는다', () => {
    const board = createEmptyBoard();
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],            [0, 1],
      [1, -1],  [1, 0],   [1, 1],
    ];

    // 각 방향에 상대 돌 하나와 그 바깥의 내 돌을 두어 포위를 만든다.
    for (const [rowStep, colStep] of directions) {
      board[3 + rowStep][3 + colStep] = 'white';
      board[3 + rowStep * 2][3 + colStep * 2] = 'black';
    }

    const flips = getFlips(board, 3, 3, 'black');

    expect(flips).toHaveLength(8);
    for (const [rowStep, colStep] of directions) {
      expect(flips).toContainEqual([3 + rowStep, 3 + colStep]);
    }
  });

  it('모서리에서 보드 밖으로 나가지 않고 유효한 포위를 찾는다', () => {
    const board = createEmptyBoard();
    board[0][1] = 'white';
    board[0][2] = 'black';

    expect(getFlips(board, 0, 0, 'black')).toEqual([[0, 1]]);
  });

  it('범위 밖, 이미 찬 칸, 포위가 안 되는 수는 뒤집을 돌이 없다', () => {
    const board = createInitialBoard();

    expect(getFlips(board, -1, 0, 'black')).toEqual([]);
    expect(getFlips(board, 3, 3, 'black')).toEqual([]);
    expect(getFlips(board, 0, 0, 'black')).toEqual([]);
    expect(getFlips(board, 2, 3, 'unknown')).toEqual([]);
  });
});

describe('getLegalMoves', () => {
  it('시작할 때 흑에게 정확히 네 개의 합법 수가 있다', () => {
    expect(getLegalMoves(createInitialBoard(), 'black')).toEqual([
      { row: 2, col: 3 },
      { row: 3, col: 2 },
      { row: 4, col: 5 },
      { row: 5, col: 4 },
    ]);
  });

  it('유효하지 않은 플레이어에게는 합법 수를 주지 않는다', () => {
    expect(getLegalMoves(createInitialBoard(), 'green')).toEqual([]);
  });
});

describe('applyMove', () => {
  it('실제 착수 결과에서도 여러 방향의 포위된 돌을 모두 뒤집는다', () => {
    const board = createEmptyBoard();
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],            [0, 1],
      [1, -1],  [1, 0],   [1, 1],
    ];

    for (const [rowStep, colStep] of directions) {
      board[3 + rowStep][3 + colStep] = 'white';
      board[3 + rowStep * 2][3 + colStep * 2] = 'black';
    }

    const nextBoard = applyMove(board, 3, 3, 'black');

    expect(nextBoard[3][3]).toBe('black');
    for (const [rowStep, colStep] of directions) {
      expect(nextBoard[3 + rowStep][3 + colStep]).toBe('black');
    }
  });

  it('합법 수를 두고 새 보드를 반환하며 입력 보드는 보존한다', () => {
    const board = createInitialBoard();
    const originalBoard = board.map((row) => [...row]);

    const nextBoard = applyMove(board, 2, 3, 'black');

    expect(nextBoard).not.toBeNull();
    expect(nextBoard).not.toBe(board);
    expect(nextBoard[2][3]).toBe('black');
    expect(nextBoard[3][3]).toBe('black');
    expect(board).toEqual(originalBoard);
  });

  it('무효한 수에는 null을 반환하고 보드는 바꾸지 않는다', () => {
    const board = createInitialBoard();
    const originalBoard = board.map((row) => [...row]);

    expect(applyMove(board, 0, 0, 'black')).toBeNull();
    expect(applyMove(board, 3, 3, 'black')).toBeNull();
    expect(applyMove(board, 2, 3, 'purple')).toBeNull();
    expect(board).toEqual(originalBoard);
  });
});

describe('getNextTurn', () => {
  it('상대가 둘 수 있으면 상대 차례로 바꾼다', () => {
    const board = applyMove(createInitialBoard(), 2, 3, 'black');

    expect(getNextTurn(board, 'black')).toEqual({
      currentPlayer: 'white',
      status: 'playing',
      passed: false,
      winner: null,
    });
  });

  it('상대는 둘 수 없고 방금 둔 플레이어는 둘 수 있으면 차례를 넘긴다', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill('black'));
    board[7][6] = 'white';
    board[7][7] = null;

    expect(getNextTurn(board, 'black')).toEqual({
      currentPlayer: 'black',
      status: 'playing',
      passed: true,
      winner: null,
    });
  });

  it('빈 칸이 남아 있어도 양쪽 모두 둘 수 없으면 점수로 승자를 정한다', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill('black'));
    board[7][7] = null;

    expect(getNextTurn(board, 'black')).toEqual({
      currentPlayer: 'black',
      status: 'finished',
      passed: false,
      winner: 'black',
    });
  });

  it('종료 시 점수가 같으면 무승부를 반환한다', () => {
    const board = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) =>
        (row + col) % 2 === 0 ? 'black' : 'white',
      ),
    );

    expect(getNextTurn(board, 'white')).toEqual({
      currentPlayer: 'white',
      status: 'finished',
      passed: false,
      winner: null,
    });
  });
});

describe('countDiscs', () => {
  it('보드의 흑과 백 돌 수를 계산한다', () => {
    expect(countDiscs(createInitialBoard())).toEqual({ black: 2, white: 2 });
  });
});
