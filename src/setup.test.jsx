import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('오델로 게임 화면', () => {
  it('초기 보드, 합법 수, 차례와 점수를 표시한다', () => {
    const markup = renderToStaticMarkup(<App />);
    const boardCells = markup.match(/class="board-cell/g) ?? [];

    expect(markup).toContain('<main');
    expect(markup).toContain('오델로');
    expect(boardCells).toHaveLength(64);
    expect(markup).toContain('D3, 빈 칸, 가능한 수');
    expect(markup).toContain('현재 차례');
    expect(markup).toContain('흑');
    expect(markup).toContain('백');
    expect(markup).toContain('새 게임');
  });
});
