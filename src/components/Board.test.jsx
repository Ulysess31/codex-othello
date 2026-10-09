import { describe, expect, it } from 'vitest';
import { getNextCellPosition } from './boardNavigation.js';

describe('보드 키보드 이동', () => {
  it('네 방향키로 한 칸씩 이동한다', () => {
    expect(getNextCellPosition(3, 3, 'ArrowUp')).toEqual({ row: 2, col: 3 });
    expect(getNextCellPosition(3, 3, 'ArrowDown')).toEqual({ row: 4, col: 3 });
    expect(getNextCellPosition(3, 3, 'ArrowLeft')).toEqual({ row: 3, col: 2 });
    expect(getNextCellPosition(3, 3, 'ArrowRight')).toEqual({ row: 3, col: 4 });
  });

  it('보드 가장자리에서는 다음 칸으로 넘어가지 않는다', () => {
    expect(getNextCellPosition(0, 0, 'ArrowUp')).toEqual({ row: 0, col: 0 });
    expect(getNextCellPosition(0, 0, 'ArrowLeft')).toEqual({ row: 0, col: 0 });
    expect(getNextCellPosition(7, 7, 'ArrowDown')).toEqual({ row: 7, col: 7 });
    expect(getNextCellPosition(7, 7, 'ArrowRight')).toEqual({ row: 7, col: 7 });
  });

  it('방향키가 아닌 키에는 이동 좌표를 만들지 않는다', () => {
    expect(getNextCellPosition(3, 3, 'Enter')).toBeNull();
  });
});
