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
    expect(markup).toContain('D3, 빈 칸, 놓을 수 있는 칸');
    expect(markup).toContain('키보드: Tab으로 보드에 들어온 뒤');
    expect(markup).toContain('role="group" aria-label="오델로 보드"');
    expect(markup.match(/tabindex="0"/g) ?? []).toHaveLength(1);
    expect(markup).toContain('A1, 빈 칸, 둘 수 없는 칸');
    expect(markup).toContain('현재 차례');
    expect(markup).toContain('흑');
    expect(markup).toContain('백');
    expect(markup).toContain('새 게임');
  });
});
