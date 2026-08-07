import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

// 絵コンテ静止画をKen Burns(ゆっくりズーム+微パン)で1カット分表示する。
// 画像は public/storyboard/cutN.png(1920x1080)に置く。
// 編集指示書の落ち着いたトーンに合わせ、動きは1.00→1.06倍・パン±14pxの極小に留める。
export const StoryboardStill: React.FC<{
  src: string; // public/からの相対パス(例: 'storyboard/cut1.png')
  durationInFrames: number;
  direction?: 1 | -1; // パン方向(隣接カットで交互にすると単調にならない)
}> = ({ src, durationInFrames, direction = 1 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = 1.0 + 0.06 * t;
  const panX = 14 * direction * (t - 0.5);
  const panY = -8 * t;
  return (
    <AbsoluteFill style={{ background: '#fdfdfb', overflow: 'hidden' }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
