import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages는 저장소 이름 하위 경로에 게시한다.
  base: '/codex-othello/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
