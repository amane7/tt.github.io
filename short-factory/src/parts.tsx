import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { COLORS, FONT_STACK } from './theme';

// ---- カード表示ルール(編集指示書 §4)----
// 0.25秒フェード + 下から8px。Ease Out。バウンド禁止。
export const useCardIn = (appearSec: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [appearSec * fps, (appearSec + 0.25) * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });
  return { opacity: t, transform: `translateY(${8 * (1 - t)}px)` };
};

export const Card: React.FC<{
  appear: number; // カット内ローカル秒
  color?: string;
  fill?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ appear, color = COLORS.mint, fill = '#ffffff', style, children }) => {
  const anim = useCardIn(appear);
  return (
    <div
      style={{
        border: `3px solid ${color}`,
        background: fill,
        borderRadius: 24, // 角丸24px前後
        padding: '28px 36px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.05)', // 影5%以下
        fontFamily: FONT_STACK,
        color: COLORS.ink,
        ...anim,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---- 人物プレースホルダ ----
// キャラ素材の入稿待ちの間、構図確認用に置く簡易人物。
// 素材が届いたら <Img> 差し替え(cuts.tsx側のPersonを置換)。
export const Person: React.FC<{
  x: number;
  y: number;
  h?: number;
  variant?: 'hero' | 'colleague' | 'generic';
  mood?: 'tired' | 'neutral' | 'thinking' | 'relaxed';
  hue?: string;
}> = ({ x, y, h = 420, variant = 'hero', mood = 'neutral', hue }) => {
  const skin = '#fce8d5';
  const hair = variant === 'colleague' ? '#8a6248' : '#3a3a3a';
  const shirt = hue ?? (variant === 'colleague' ? '#f5e6c8' : '#ffffff');
  const tie = variant === 'hero';
  const w = h * 0.62;
  const browY = mood === 'tired' || mood === 'thinking' ? 4 : 0;
  const mouth =
    mood === 'relaxed'
      ? 'M -14 22 Q 0 32 14 22'
      : mood === 'tired'
        ? 'M -12 26 Q 0 20 12 26'
        : 'M -12 24 L 12 24';
  return (
    <svg width={w} height={h} viewBox="0 0 200 320" style={{ position: 'absolute', left: x, top: y }}>
      {/* 胴体 */}
      <path
        d="M 40 320 L 44 220 Q 48 180 100 176 Q 152 180 156 220 L 160 320 Z"
        fill={shirt}
        stroke={COLORS.ink}
        strokeWidth={4}
      />
      {tie && <path d="M 96 178 L 104 178 L 106 240 L 100 252 L 94 240 Z" fill={COLORS.mint} stroke={COLORS.ink} strokeWidth={2.5} />}
      {/* 頭 */}
      <circle cx={100} cy={110} r={62} fill={skin} stroke={COLORS.ink} strokeWidth={4} />
      {/* 髪 */}
      <path
        d="M 40 104 Q 38 48 100 44 Q 162 48 160 104 Q 150 74 122 68 Q 132 84 118 82 Q 92 60 66 84 Q 50 90 40 104 Z"
        fill={hair}
        stroke={COLORS.ink}
        strokeWidth={3}
      />
      {/* 顔 */}
      <g transform="translate(100 118)">
        <line x1={-34} y1={-16 + browY} x2={-16} y2={-18 + browY} stroke={COLORS.ink} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={16} y1={-18 + browY} x2={34} y2={-16 + browY} stroke={COLORS.ink} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={-24} cy={-2} r={4.5} fill={COLORS.ink} />
        <circle cx={24} cy={-2} r={4.5} fill={COLORS.ink} />
        <path d={mouth} fill="none" stroke={COLORS.ink} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={-40} cy={12} r={7} fill="#f5b8ad" opacity={0.55} />
        <circle cx={40} cy={12} r={7} fill="#f5b8ad" opacity={0.55} />
      </g>
    </svg>
  );
};

// ---- 吹き出し ----
export const Bubble: React.FC<{
  appear: number;
  x: number;
  y: number;
  w: number;
  color?: string;
  tail?: 'left' | 'right';
  children: React.ReactNode;
}> = ({ appear, x, y, w, color = COLORS.ink, tail = 'left', children }) => {
  const anim = useCardIn(appear);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        background: '#ffffff',
        border: `3px solid ${color}`,
        borderRadius: 28,
        padding: '20px 28px',
        fontFamily: FONT_STACK,
        fontSize: 34,
        lineHeight: 1.5,
        color: COLORS.ink,
        ...anim,
      }}
    >
      {children}
      <svg
        width={36}
        height={28}
        style={{ position: 'absolute', bottom: -26, [tail === 'left' ? 'left' : 'right']: 48 }}
      >
        <path
          d={tail === 'left' ? 'M 4 0 L 32 0 L 12 26 Z' : 'M 4 0 L 32 0 L 24 26 Z'}
          fill="#ffffff"
          stroke={color}
          strokeWidth={3}
        />
      </svg>
    </div>
  );
};

// ---- 字幕レイヤー(編集指示書 §5)----
// 黒文字+白半透明帯。セーフマージン: 左右8%・下端8%以上。
export const SubtitleLayer: React.FC<{
  subtitles: { start: number; end: number; text: string }[];
  // 字幕を高めに出す時間帯(秒)。絵コンテ画像の下部に焼き込みテキストがある
  // カットで、バナーとの重なりを避けるために使う。
  raisedRanges?: [number, number][];
}> = ({ subtitles, raisedRanges = [] }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  // 2〜4フレーム早出し・遅消し
  const lead = 3 / fps;
  const active = subtitles.find((s) => t >= s.start - lead && t <= s.end + lead);
  if (!active) return null;
  const raised = raisedRanges.some(([a, b]) => t >= a && t < b);
  return (
    <div
      style={{
        position: 'absolute',
        left: width * 0.08,
        right: width * 0.08,
        bottom: height * (raised ? 0.215 : 0.085),
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.94)',
          border: `2px solid rgba(43,43,43,0.15)`,
          borderRadius: 16,
          padding: '14px 34px',
          fontFamily: FONT_STACK,
          fontSize: 46,
          fontWeight: 500,
          lineHeight: 1.45,
          color: COLORS.ink,
          textAlign: 'center',
          whiteSpace: 'pre-line',
        }}
      >
        {active.text}
      </div>
    </div>
  );
};

// ---- 見出し(手描き風アンダーライン付き)----
export const Heading: React.FC<{ appear?: number; children: React.ReactNode }> = ({ appear = 0, children }) => {
  const anim = useCardIn(appear);
  return (
    <div style={{ position: 'absolute', top: 56, left: 0, right: 0, textAlign: 'center', ...anim }}>
      <span
        style={{
          fontFamily: FONT_STACK,
          fontSize: 58,
          fontWeight: 700,
          color: COLORS.ink,
          borderBottom: `6px solid ${COLORS.mint}`,
          paddingBottom: 10,
        }}
      >
        {children}
      </span>
    </div>
  );
};
