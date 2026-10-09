import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages는 저장소 하위 경로, Vercel은 도메인 루트에 게시한다.
  base: process.env.VERCEL ? '/' : '/codex-othello/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
