const PLAYER_NAMES = {
  black: '흑',
  white: '백',
};

function GameInfo({ currentPlayer, score, status, winner, message, onNewGame }) {
  let resultText = '';
  if (status === 'finished') {
    resultText = winner ? `${PLAYER_NAMES[winner]} 승리` : '무승부';
  }

  return (
    <section className="game-info" aria-label="게임 정보">
      <div className="turn-card">
        <span className={`turn-disc turn-disc--${currentPlayer}`} aria-hidden="true" />
        <div>
          <p className="eyebrow">현재 차례</p>
          <p className="current-player">{PLAYER_NAMES[currentPlayer]}</p>
        </div>
      </div>

      <div className="score-list" aria-label="현재 점수">
        <div className="score-card">
          <span className="score-disc score-disc--black" aria-hidden="true" />
          <span>흑</span>
          <strong>{score.black}</strong>
        </div>
        <div className="score-card">
          <span className="score-disc score-disc--white" aria-hidden="true" />
          <span>백</span>
          <strong>{score.white}</strong>
        </div>
      </div>

      {resultText && <p className="result-text">{resultText}</p>}
      <p className="game-message" role="status" aria-live="polite">{message}</p>

      <button className="new-game-button" type="button" onClick={onNewGame}>
        새 게임
      </button>
    </section>
  );
}

export default GameInfo;
