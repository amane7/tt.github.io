import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { CUT_TIMES, subtitles } from './cues/mental-health-90s';
import { SubtitleLayer } from './parts';
import { StoryboardStill } from './StoryboardStill';
import { Cut1, Cut2, Cut3, Cut4, Cut5, Cut6, Cut7, Cut8 } from './cuts';

const CUTS = [Cut1, Cut2, Cut3, Cut4, Cut5, Cut6, Cut7, Cut8];

export const MentalHealth90s: React.FC<{
  audioSrc?: string; // public/内のナレーション(TTS収録後に指定)
  bgmSrc?: string; // public/内のBGM
  bgmVolume?: number;
  aiVoiceLabel?: string; // AI音声利用時の動画内小表記
  // 絵コンテ静止画の差し替え表: カット番号(1〜8)→ public/内パス。
  // 指定したカットはコード描画の代わりに静止画+Ken Burnsで表示する。
  storyboard?: Partial<Record<number, string>>;
}> = ({ audioSrc, bgmSrc, bgmVolume = 0.16, aiVoiceLabel, storyboard = {} }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: '#fdfdfb' }}>
      {CUTS.map((Cut, i) => {
        const dur = Math.round((CUT_TIMES[i + 1] - CUT_TIMES[i]) * fps);
        const still = storyboard[i + 1];
        return (
          <Sequence key={i} from={Math.round(CUT_TIMES[i] * fps)} durationInFrames={dur}>
            {still ? (
              <StoryboardStill src={still} durationInFrames={dur} direction={i % 2 === 0 ? 1 : -1} />
            ) : (
              <Cut />
            )}
          </Sequence>
        );
      })}
      <SubtitleLayer
        subtitles={subtitles}
        // 絵コンテ画像の下部バナーが「画の主メッセージ」であるカットだけ字幕を持ち上げる。
        // cut3/4は持ち上げると図版の項目リストに被るため標準位置(下部ノートへの
        // 一時的な重なりを許容)。cut1/5/6は下部中央が空いているため標準位置が正
        raisedRanges={[2, 8]
          .filter((n) => storyboard[n])
          .map((n) => [CUT_TIMES[n - 1], CUT_TIMES[n]] as [number, number])}
      />
      {aiVoiceLabel && (
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 36,
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 24,
            color: '#8a8a8a',
          }}
        >
          {aiVoiceLabel}
        </div>
      )}
      {audioSrc && <Audio src={staticFile(audioSrc)} />}
      {bgmSrc && <Audio src={staticFile(bgmSrc)} volume={bgmVolume} />}
    </AbsoluteFill>
  );
};
