import { useRef, useState } from 'react';
import { getNextCellPosition } from './boardNavigation.js';

const COLUMN_LABELS = 'ABCDEFGH';
const BOARD_SIZE = 8;

function getCellName(cell) {
  if (cell === 'black') return '흑 돌';
  if (cell === 'white') return '백 돌';
  return '빈 칸';
}

function Board({ board, legalMoves, onCellClick, disabled = false }) {
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const cellRefs = useRef([]);

  // 합법 수를 빠르게 표시할 수 있도록 좌표를 검색용 Set으로 바꾼다.
  const legalMoveKeys = new Set(
    legalMoves.map(({ row, col }) => `${row}-${col}`),
  );

  return (
    <div className="board-area">
      <p className="board-instructions" id="board-instructions">
        키보드: Tab으로 보드에 들어온 뒤 방향키로 이동하고 Enter 또는 Space로 선택하세요.
      </p>
      <div
        className="board"
        role="group"
        aria-label="오델로 보드"
        aria-describedby="board-instructions"
      >
        {board.map((boardRow, row) =>
          boardRow.map((cell, col) => {
            const coordinate = `${COLUMN_LABELS[col]}${row + 1}`;
            const isLegalMove = legalMoveKeys.has(`${row}-${col}`);
            const cellClass = [
              'board-cell',
              isLegalMove ? 'board-cell--legal' : '',
            ].filter(Boolean).join(' ');

            return (
              <button
                className={cellClass}
                type="button"
                key={`${row}-${col}`}
                aria-label={`${coordinate}, ${getCellName(cell)}, ${isLegalMove ? '놓을 수 있는 칸' : '둘 수 없는 칸'}`}
                tabIndex={activeCell.row === row && activeCell.col === col ? 0 : -1}
                disabled={disabled}
                ref={(element) => {
                  cellRefs.current[row * BOARD_SIZE + col] = element;
                }}
                onFocus={() => setActiveCell({ row, col })}
                onKeyDown={(event) => {
                  const nextCell = getNextCellPosition(row, col, event.key);
                  if (!nextCell) return;

                  event.preventDefault();
                  cellRefs.current[nextCell.row * BOARD_SIZE + nextCell.col]?.focus();
                }}
                onClick={() => onCellClick(row, col)}
              >
                {cell && <span className={`disc disc--${cell}`} aria-hidden="true" />}
                {isLegalMove && <span className="move-indicator" aria-hidden="true">•</span>}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}

export default Board;
