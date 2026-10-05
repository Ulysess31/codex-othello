import { useState } from 'react';
import Board from './components/Board.jsx';
import GameInfo from './components/GameInfo.jsx';
import {
  applyMove,
  countDiscs,
  createInitialBoard,
  getLegalMoves,
  getNextTurn,
} from './game/othello.js';

function createNewGame() {
  return {
    board: createInitialBoard(),
    currentPlayer: 'black',
    status: 'playing',
    winner: null,
    message: '흑 차례입니다. 표시된 칸 중 하나를 선택하세요.',
  };
}

function App() {
  const [game, setGame] = useState(createNewGame);
  const score = countDiscs(game.board);
  const legalMoves = game.status === 'playing'
    ? getLegalMoves(game.board, game.currentPlayer)
    : [];

  function handleCellClick(row, col) {
    if (game.status === 'finished') return;

    const nextBoard = applyMove(game.board, row, col, game.currentPlayer);
    if (!nextBoard) {
      setGame((previousGame) => ({
        ...previousGame,
        message: '그 칸에는 둘 수 없습니다. 표시된 칸을 선택하세요.',
      }));
      return;
    }

    const nextTurn = getNextTurn(nextBoard, game.currentPlayer);
    let message = `${nextTurn.currentPlayer === 'black' ? '흑' : '백'} 차례입니다.`;

    if (nextTurn.passed) {
      message = `상대가 둘 곳이 없어 ${message} 한 번 더 진행합니다.`;
    }

    if (nextTurn.status === 'finished') {
      if (nextTurn.winner) {
        message = `${nextTurn.winner === 'black' ? '흑' : '백'}이(가) 승리했습니다.`;
      } else {
        message = '무승부입니다.';
      }
    }

    // 보드, 차례, 결과를 한 번에 바꿔 화면에 서로 다른 상태가 섞이지 않게 한다.
    setGame({
      board: nextBoard,
      currentPlayer: nextTurn.currentPlayer,
      status: nextTurn.status,
      winner: nextTurn.winner,
      message,
    });
  }

  function handleNewGame() {
    if (game.status === 'playing') {
      const confirmed = window.confirm('진행 중인 게임을 끝내고 새로 시작할까요?');
      if (!confirmed) return;
    }

    setGame(createNewGame());
  }

  return (
    <main className="app-shell">
      <header className="page-heading">
        <p className="eyebrow">두 사람이 함께 즐기는</p>
        <h1>오델로</h1>
        <p>상대의 돌을 양쪽에서 포위해 뒤집으세요.</p>
      </header>

      <div className="game-layout">
        <Board
          board={game.board}
          legalMoves={legalMoves}
          onCellClick={handleCellClick}
          disabled={game.status === 'finished'}
        />
        <GameInfo
          currentPlayer={game.currentPlayer}
          score={score}
          status={game.status}
          winner={game.winner}
          message={game.message}
          onNewGame={handleNewGame}
        />
      </div>
    </main>
  );
}

export default App;
