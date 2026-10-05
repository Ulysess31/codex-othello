const COLUMN_LABELS = 'ABCDEFGH';

function getCellName(cell) {
  if (cell === 'black') return '흑 돌';
  if (cell === 'white') return '백 돌';
  return '빈 칸';
}

function Board({ board, legalMoves, onCellClick, disabled = false }) {
  // 합법 수를 빠르게 표시할 수 있도록 좌표를 검색용 Set으로 바꾼다.
  const legalMoveKeys = new Set(
    legalMoves.map(({ row, col }) => `${row}-${col}`),
  );

  return (
    <div className="board" role="group" aria-label="오델로 보드">
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
              aria-label={`${coordinate}, ${getCellName(cell)}${isLegalMove ? ', 가능한 수' : ''}`}
              disabled={disabled}
              onClick={() => onCellClick(row, col)}
            >
              {cell && <span className={`disc disc--${cell}`} aria-hidden="true" />}
              {isLegalMove && <span className="move-indicator" aria-hidden="true">•</span>}
            </button>
          );
        }),
      )}
    </div>
  );
}

export default Board;
