// 編集指示書 §2 ビジュアル統一 のアクセント色
export const COLORS = {
  ink: '#2b2b2b', // 黒アウトライン(真っ黒より柔らかい)
  paper: '#fdfdfb', // 白背景
  mint: '#5bbfa9', // 気づき・安心
  mintPale: '#e8f6f2',
  pink: '#e8879c', // 共感・本人の意思
  pinkPale: '#fdeef1',
  yellow: '#f2c94c', // 希望・補足
  yellowPale: '#fdf6e0',
  cyan: '#56b6c9', // 情報・仕組み
  cyanPale: '#e9f6f8',
  orange: '#ef9a5e', // 終幕・前向きさ
  orangePale: '#fdf0e4',
  gray: '#8a8a8a',
} as const;

export const FONT_STACK =
  "'Noto Sans JP', 'BIZ UDPGothic', 'Hiragino Sans', sans-serif";

// 手描き風の下線などに使う丸みの強い線
export const STROKE = { width: 3, color: COLORS.ink } as const;
