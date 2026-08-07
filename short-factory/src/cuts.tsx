import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { COLORS, FONT_STACK } from './theme';
import { Card, Person, Bubble, Heading, useCardIn } from './parts';

const ease = Easing.inOut(Easing.ease);

// カメラのゆっくりした寄り/引き(%指定)
const useCamera = (fromScale: number, toScale: number, startSec: number, endSec: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = interpolate(frame, [startSec * fps, endSec * fps], [fromScale, toScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return { transform: `scale(${s})` };
};

const Base: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <AbsoluteFill style={{ background: COLORS.paper, fontFamily: FONT_STACK, color: COLORS.ink, ...style }}>
    {children}
  </AbsoluteFill>
);

// 背景のオフィス小物(観葉植物・棚・窓)。全カット共通のトーン合わせ
const OfficeHint: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity }}>
    <rect x={60} y={620} width={200} height={300} rx={12} fill="#f1efe9" stroke={COLORS.ink} strokeWidth={2.5} />
    <line x1={60} y1={720} x2={260} y2={720} stroke={COLORS.ink} strokeWidth={2} />
    <line x1={60} y1={820} x2={260} y2={820} stroke={COLORS.ink} strokeWidth={2} />
    <g transform="translate(150 520)">
      <path d="M 0 100 Q -34 60 -20 20 Q 0 52 0 100 Z" fill="#a8cf9f" stroke={COLORS.ink} strokeWidth={2.5} />
      <path d="M 0 100 Q 34 56 24 10 Q 2 48 0 100 Z" fill="#8fc487" stroke={COLORS.ink} strokeWidth={2.5} />
      <path d="M -28 100 L 28 100 L 22 150 L -22 150 Z" fill="#ffffff" stroke={COLORS.ink} strokeWidth={2.5} />
    </g>
    <rect x={1660} y={80} width={200} height={380} rx={10} fill="#eef5fa" stroke={COLORS.ink} strokeWidth={2} opacity={0.8} />
    <line x1={1760} y1={80} x2={1760} y2={460} stroke={COLORS.ink} strokeWidth={1.5} opacity={0.6} />
  </svg>
);

// ============ CUT 1 | 0:00–0:10 | HOOK ============
export const Cut1: React.FC = () => {
  const cam = useCamera(1.0, 1.08, 3, 8); // 8%プッシュイン
  return (
    <Base>
      <AbsoluteFill style={cam}>
        <OfficeHint />
        {/* デスク+PC */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <rect x={430} y={700} width={720} height={26} rx={8} fill="#e8e2d6" stroke={COLORS.ink} strokeWidth={3} />
          <rect x={640} y={520} width={300} height={186} rx={12} fill="#ffffff" stroke={COLORS.ink} strokeWidth={4} />
          <rect x={760} y={706} width={60} height={10} fill="#d8d2c6" stroke={COLORS.ink} strokeWidth={2} />
        </svg>
        {/* 主人公: 頬杖・わずかに疲れた表情。周辺のみ彩度低め */}
        <Person x={960} y={330} h={460} variant="hero" mood="tired" />
        {/* 疲労スクラッチ(0:02) */}
        <ScratchMark appear={2} x={1130} y={300} />
      </AbsoluteFill>
      {/* 付箋カード(0:05 右からスライドイン) */}
      <StickyNote appear={5} x={1350} y={620} w={470} text={'こころの変化は、本人にも\n周りにも気づきにくい。'} />
    </Base>
  );
};

const ScratchMark: React.FC<{ appear: number; x: number; y: number }> = ({ appear, x, y }) => {
  const anim = useCardIn(appear);
  return (
    <svg width={90} height={70} style={{ position: 'absolute', left: x, top: y, ...anim }}>
      <path d="M 8 40 Q 20 10 34 36 Q 46 8 58 34 Q 68 12 80 30" fill="none" stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};

const StickyNote: React.FC<{ appear: number; x: number; y: number; w: number; text: string }> = ({ appear, x, y, w, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [appear * fps, appear * fps + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x + 60 * (1 - t),
        top: y,
        width: w,
        opacity: t,
        background: COLORS.mintPale,
        border: `3px solid ${COLORS.mint}`,
        borderRadius: 6,
        padding: '22px 26px',
        fontSize: 29,
        lineHeight: 1.55,
        whiteSpace: 'pre-line',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        transform: 'rotate(-1.5deg)',
      }}
    >
      {text}
    </div>
  );
};

// ============ CUT 2 | 0:10–0:20 | 共感の分かれ道 ============
export const Cut2: React.FC = () => (
  <Base>
    <OfficeHint opacity={0.5} />
    {/* 中央点線 */}
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <line x1={960} y1={140} x2={960} y2={860} stroke={COLORS.gray} strokeWidth={3} strokeDasharray="14 14" />
    </svg>
    <Person x={430} y={330} h={480} variant="hero" mood="tired" />
    <Person x={1210} y={330} h={480} variant="colleague" mood="thinking" />
    {/* 視線矢印(0:14 手描き線が伸びる) */}
    <SightArrow appear={4} />
    <Bubble appear={1.0} x={260} y={130} w={420} color={COLORS.pink} tail="right">
      まだ頑張れる
    </Bubble>
    <Bubble appear={5.0} x={1240} y={110} w={520} color={COLORS.mint} tail="left">
      声をかけてよいのか、
      <br />
      わからない…
    </Bubble>
    <BottomBand appear={7.5} text="誰かが悪いわけではありません。" />
  </Base>
);

const SightArrow: React.FC<{ appear: number }> = ({ appear }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [appear * fps, (appear + 0.8) * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const len = 560;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <path
        d={`M 680 470 Q 960 400 ${680 + len} 470`}
        fill="none"
        stroke={COLORS.pink}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={700}
        strokeDashoffset={700 * (1 - t)}
        opacity={0.85}
      />
      {t > 0.95 && (
        <path d={`M ${680 + len - 26} 448 L ${680 + len + 4} 468 L ${680 + len - 34} 478 Z`} fill={COLORS.pink} opacity={0.85} />
      )}
    </svg>
  );
};

const BottomBand: React.FC<{ appear: number; text: string; bottom?: number }> = ({ appear, text, bottom = 310 }) => {
  const anim = useCardIn(appear);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        textAlign: 'center',
        ...anim,
      }}
    >
      <span
        style={{
          background: COLORS.yellowPale,
          border: `3px solid ${COLORS.yellow}`,
          borderRadius: 999,
          padding: '14px 44px',
          fontSize: 36,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ============ CUT 3 | 0:20–0:30 | なぜ気づきにくいのか ============
const SIGN_ITEMS_MIND = ['疲れやすい', '集中しにくい', '表情が暗い', 'イライラしやすい'];
const SIGN_ITEMS_ENV = ['忙しさ・締切', '役割の変化', '人間関係の負担', '環境の変化'];

export const Cut3: React.FC = () => (
  <Base>
    <Heading>なぜ気づきにくいのか</Heading>
    <Person x={140} y={280} h={520} variant="hero" mood="thinking" />
    <SignCard appear={3} x={640} y={210} title="こころのサイン" color={COLORS.pink} fill={COLORS.pinkPale} items={SIGN_ITEMS_MIND} itemStart={3.2} />
    <SignCard appear={6} x={1240} y={210} title="状況のサイン" color={COLORS.mint} fill={COLORS.mintPale} items={SIGN_ITEMS_ENV} itemStart={6.2} />
    <HandNote appear={8.6} text="良かれと思うがんばりが、サインを見えにくくすることも。" />
  </Base>
);

const SignCard: React.FC<{
  appear: number;
  x: number;
  y: number;
  title: string;
  color: string;
  fill: string;
  items: string[];
  itemStart: number;
}> = ({ appear, x, y, title, color, fill, items, itemStart }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 520 }}>
    <Card appear={appear} color={color} fill="#ffffff" style={{ padding: '26px 32px' }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: 44,
          fontWeight: 700,
          background: fill,
          borderRadius: 14,
          padding: '8px 0',
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {items.map((it, i) => (
        <SignItem key={it} appear={itemStart + i * 0.35} text={it} color={color} last={i === items.length - 1} />
      ))}
    </Card>
  </div>
);

const SignItem: React.FC<{ appear: number; text: string; color: string; last: boolean; small?: boolean }> = ({
  appear,
  text,
  color,
  last,
  small,
}) => {
  const anim = useCardIn(appear);
  return (
    <div
      style={{
        fontSize: small ? 32 : 38,
        whiteSpace: 'nowrap',
        padding: '16px 8px',
        borderBottom: last ? 'none' : `2px dashed ${color}55`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        ...anim,
      }}
    >
      <svg width={34} height={34} viewBox="0 0 34 34">
        <path d="M 6 18 L 14 26 L 28 8" fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </div>
  );
};

const HandNote: React.FC<{ appear: number; text: string }> = ({ appear, text }) => {
  const anim = useCardIn(appear);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 310, textAlign: 'center', ...anim }}>
      <span
        style={{
          fontSize: 36,
          color: COLORS.mint,
          fontWeight: 600,
          borderBottom: `3px dashed ${COLORS.cyan}`,
          paddingBottom: 8,
        }}
      >
        💡 {text}
      </span>
    </div>
  );
};

// ============ CUT 4 | 0:30–0:40 | 早めの気づきを支える ============
const FLOW = [
  { label: '変化の兆し', color: COLORS.pink, pale: COLORS.pinkPale },
  { label: 'セルフケア', color: COLORS.yellow, pale: COLORS.yellowPale },
  { label: '相談', color: COLORS.mint, pale: COLORS.mintPale },
];

export const Cut4: React.FC = () => {
  const cam = useCamera(1.0, 1.05, 6, 10);
  return (
    <Base>
      <Heading>早めの気づきを支える仕組み</Heading>
      <AbsoluteFill style={cam}>
        {FLOW.map((f, i) => (
          <FlowNode key={f.label} appear={0.8 + i * 1.6} x={200 + i * 360} y={430} {...f} />
        ))}
        {[0, 1].map((i) => (
          <FlowArrow key={i} appear={1.8 + i * 1.6} x={452 + i * 360} y={520} />
        ))}
        <div style={{ position: 'absolute', left: 1250, top: 300, width: 560 }}>
          <Card appear={5.5} color={COLORS.cyan}>
            <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.cyan, marginBottom: 14 }}>
              データは集計・分析
              <br />
              (個人を特定しません)
            </div>
            {['傾向を把握', '安全な分析でサポート', '早めの支援へつなぐ'].map((t, i) => (
              <SignItem key={t} appear={6.0 + i * 0.35} text={t} color={COLORS.cyan} last={i === 2} small />
            ))}
          </Card>
        </div>
      </AbsoluteFill>
      <BottomBand appear={8.2} text="本人の選択を尊重しながら、よりよいサポートを目指します。" />
    </Base>
  );
};

const FlowNode: React.FC<{ appear: number; x: number; y: number; label: string; color: string; pale: string }> = ({
  appear,
  x,
  y,
  label,
  color,
  pale,
}) => {
  const anim = useCardIn(appear);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 220,
        height: 220,
        borderRadius: '50%',
        background: pale,
        border: `4px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 38,
        fontWeight: 700,
        ...anim,
      }}
    >
      {label}
    </div>
  );
};

const FlowArrow: React.FC<{ appear: number; x: number; y: number }> = ({ appear, x, y }) => {
  const anim = useCardIn(appear);
  return (
    <svg width={90} height={40} style={{ position: 'absolute', left: x, top: y, ...anim }}>
      <line x1={4} y1={20} x2={64} y2={20} stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" />
      <path d="M 60 6 L 84 20 L 60 34 Z" fill={COLORS.ink} />
    </svg>
  );
};

// ============ CUT 5 | 0:40–0:55 | 安心の仕組み ============
// 表示中カード105%・非表示95%薄め。最後に全カード同濃度(編集指示書 §3)
const SAFETY_CARDS = [
  { text: '同意した方のデータのみ利用', color: COLORS.mint },
  { text: '回答は任意', color: COLORS.pink },
  { text: '同意しなくても不利益なし', color: COLORS.yellow },
  { text: '氏名等は管理番号へ変換', color: COLORS.cyan },
  { text: '目的以外に使わない\n個人情報そのものを他社へ提供しない\nAIだけで決めつけない', color: COLORS.mint },
];

export const Cut5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // カット内アクティブ窓: 0-3 / 3-6 / 6-9 / 9-12 / 12-15。14秒以降は全カード均等
  const activeIdx = t >= 14 ? -1 : Math.min(4, Math.floor(t / 3));
  return (
    <Base>
      <Heading>安心の仕組み</Heading>
      <div
        style={{
          position: 'absolute',
          top: 195,
          left: 100,
          right: 100,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 26,
          justifyContent: 'center',
          alignContent: 'flex-start',
        }}
      >
        {SAFETY_CARDS.map((c, i) => {
          const isActive = activeIdx === -1 || activeIdx === i;
          return (
            <div
              key={i}
              style={{
                transform: `scale(${activeIdx === -1 ? 1 : isActive ? 1.05 : 0.95})`,
                opacity: activeIdx === -1 ? 1 : isActive ? 1 : 0.55,
                transition: 'none',
                width: i === 4 ? 1000 : 700,
              }}
            >
              <Card appear={i * 3} color={c.color} style={{ textAlign: 'center', padding: '24px 30px' }}>
                <span
                  style={{
                    fontSize: i === 4 ? 30 : 38,
                    fontWeight: 700,
                    whiteSpace: i === 4 ? 'pre-line' : 'nowrap',
                    lineHeight: 1.6,
                  }}
                >
                  {c.text}
                </span>
              </Card>
            </div>
          );
        })}
      </div>
      <Mascot />
    </Base>
  );
};

// 右下マスコット(説明役に限定・同意を促すポーズはさせない)
const Mascot: React.FC = () => (
  <svg width={150} height={150} viewBox="0 0 100 100" style={{ position: 'absolute', right: 70, bottom: 190 }}>
    <circle cx={50} cy={55} r={34} fill={COLORS.mintPale} stroke={COLORS.ink} strokeWidth={3} />
    <circle cx={38} cy={50} r={3.5} fill={COLORS.ink} />
    <circle cx={62} cy={50} r={3.5} fill={COLORS.ink} />
    <path d="M 42 64 Q 50 70 58 64" fill="none" stroke={COLORS.ink} strokeWidth={3} strokeLinecap="round" />
    <path d="M 30 30 Q 34 16 44 24 M 70 30 Q 66 16 56 24" fill="none" stroke={COLORS.ink} strokeWidth={3} strokeLinecap="round" />
  </svg>
);

// ============ CUT 6 | 0:55–1:10 | 協力の意味 ============
export const Cut6: React.FC = () => {
  const cam = useCamera(1.12, 1.0, 6, 12); // 中寄り→引き
  return (
    <Base>
      <AbsoluteFill style={cam}>
        <NetworkLines appear={9} />
        <Person x={830} y={310} h={460} variant="hero" mood="relaxed" />
        {/* 周囲の社員(2〜3人単位で出現) */}
        <SmallWindow appear={6.0} x={420} y={200} variant="colleague" />
        <SmallWindow appear={6.0} x={330} y={560} variant="generic" hue={COLORS.yellowPale} />
        <SmallWindow appear={7.2} x={1420} y={120} variant="generic" hue={COLORS.cyanPale} />
        <SmallWindow appear={7.2} x={1460} y={540} variant="colleague" hue={COLORS.pinkPale} />
        <SmallWindow appear={8.2} x={880} y={90} variant="generic" hue={COLORS.orangePale} />
      </AbsoluteFill>
      <Bubble appear={2.0} x={1130} y={380} w={640} color={COLORS.mint} tail="left">
        一人ひとりの協力が、
        <br />
        よりよい分析の土台になります。
      </Bubble>
      <StickyNote appear={10.5} x={60} y={770} w={480} text={'今、不調を感じている人\nだけのものではありません。'} />
    </Base>
  );
};

const SmallWindow: React.FC<{ appear: number; x: number; y: number; variant: 'hero' | 'colleague' | 'generic'; hue?: string }> = ({
  appear,
  x,
  y,
  variant,
  hue,
}) => {
  const anim = useCardIn(appear);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 190,
        height: 190,
        borderRadius: '50%',
        border: `4px solid ${COLORS.mint}`,
        background: '#ffffff',
        overflow: 'hidden',
        ...anim,
      }}
    >
      <Person x={20} y={26} h={240} variant={variant} mood="relaxed" hue={hue} />
    </div>
  );
};

const NetworkLines: React.FC<{ appear: number }> = ({ appear }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [appear * fps, (appear + 1.2) * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const center: [number, number] = [975, 540];
  const nodes: [number, number][] = [
    [515, 295],
    [425, 655],
    [1455, 275],
    [1555, 635],
    [975, 185],
  ];
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {nodes.map(([nx, ny], i) => {
        const mx = (center[0] + nx) / 2 + (i % 2 === 0 ? 40 : -40);
        const my = (center[1] + ny) / 2;
        return (
          <path
            key={i}
            d={`M ${center[0]} ${center[1]} Q ${mx} ${my} ${nx} ${ny}`}
            fill="none"
            stroke={COLORS.mint}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={0.6}
            strokeDasharray={900}
            strokeDashoffset={900 * (1 - t)}
          />
        );
      })}
    </svg>
  );
};

// ============ CUT 7 | 1:10–1:25 | 自分の意思で回答する ============
export const Cut7: React.FC = () => (
  <Base>
    <Heading>ご自身の意思で、回答を</Heading>
    {/* スマホ */}
    <div
      style={{
        position: 'absolute',
        left: 250,
        top: 230,
        width: 330,
        height: 620,
        border: `5px solid ${COLORS.ink}`,
        borderRadius: 40,
        background: '#ffffff',
        padding: '30px 22px',
      }}
    >
      <div style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, marginBottom: 18, color: COLORS.cyan }}>ご案内</div>
      {['目的・仕組み', '安心の仕組み', 'よくある質問'].map((m, i) => (
        <MenuItem key={m} appear={0.8 + i * 0.35} text={m} />
      ))}
    </div>
    {/* 3ステップ */}
    {['詳細を確認', '自分の意思で選ぶ', '回答する'].map((s, i) => (
      <div key={s} style={{ position: 'absolute', left: 700, top: 185 + i * 195, width: 1000 }}>
        <Card appear={4 + i * 2.4} color={[COLORS.mint, COLORS.pink, COLORS.cyan][i]} style={{ padding: '22px 34px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: [COLORS.mintPale, COLORS.pinkPale, COLORS.cyanPale][i],
                border: `3px solid ${[COLORS.mint, COLORS.pink, COLORS.cyan][i]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <span style={{ fontSize: 38, fontWeight: 600, whiteSpace: 'nowrap' }}>{s}</span>
            {i === 1 && (
              // 同意・不同意: 完全に同じ面積・文字サイズ・濃度(編集指示書 §4)
              <div style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
                {['同意する', '同意しない'].map((b) => (
                  <span
                    key={b}
                    style={{
                      width: 220,
                      textAlign: 'center',
                      border: `3px solid ${COLORS.ink}`,
                      borderRadius: 14,
                      padding: '12px 0',
                      fontSize: 30,
                      fontWeight: 600,
                      background: '#ffffff',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    ))}
    <BottomBand appear={12} text="どちらを選んでも不利益はありません。" bottom={265} />
  </Base>
);

const MenuItem: React.FC<{ appear: number; text: string }> = ({ appear, text }) => {
  const anim = useCardIn(appear);
  return (
    <div
      style={{
        border: `2.5px solid ${COLORS.cyan}`,
        background: COLORS.cyanPale,
        borderRadius: 12,
        padding: '14px 16px',
        fontSize: 26,
        marginBottom: 14,
        ...anim,
      }}
    >
      {text}
    </div>
  );
};

// ============ CUT 8 | 1:25–1:30 | 明るい終幕 ============
export const Cut8: React.FC = () => {
  const cam = useCamera(1.05, 1.0, 0, 3); // 5%引き
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bright = interpolate(frame, [0, 3 * fps], [0, 0.18], {
    extrapolateRight: 'clamp',
  });
  return (
    <Base>
      <AbsoluteFill style={cam}>
        <OfficeHint />
        {/* 会話・傾聴・作業が混在する社員たち */}
        <Person x={360} y={380} h={400} variant="hero" mood="relaxed" />
        <Person x={640} y={400} h={380} variant="colleague" mood="relaxed" />
        <Person x={1120} y={370} h={390} variant="generic" mood="neutral" hue={COLORS.cyanPale} />
        <Person x={1420} y={410} h={370} variant="generic" mood="relaxed" hue={COLORS.yellowPale} />
      </AbsoluteFill>
      {/* 明度アップ(CUT1比+15〜20%) */}
      <AbsoluteFill style={{ background: `rgba(255,255,255,${bright})`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center' }}>
        <Card
          appear={1.0}
          color={COLORS.orange}
          fill={COLORS.orangePale}
          style={{ display: 'inline-block', padding: '30px 60px' }}
        >
          <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {'こころの変化を見逃さず、\n自分らしく、いきいきと働ける職場を、\nみんなでつくっていきましょう。'}
          </span>
        </Card>
      </div>
      {/* 右下: QR・問い合わせ先を後から置けるセーフエリア(意図的な余白) */}
    </Base>
  );
};
