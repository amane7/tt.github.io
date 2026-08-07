import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { CUT_TIMES, subtitles } from './cues/mental-health-90s';
import { SubtitleLayer } from './parts';
import { Cut1, Cut2, Cut3, Cut4, Cut5, Cut6, Cut7, Cut8 } from './cuts';

const CUTS = [Cut1, Cut2, Cut3, Cut4, Cut5, Cut6, Cut7, Cut8];

export const MentalHealth90s: React.FC<{
  audioSrc?: string; // public/内のナレーション(TTS収録後に指定)
  bgmSrc?: string; // public/内のBGM
  bgmVolume?: number;
  aiVoiceLabel?: string; // AI音声利用時の動画内小表記
}> = ({ audioSrc, bgmSrc, bgmVolume = 0.16, aiVoiceLabel }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: '#fdfdfb' }}>
      {CUTS.map((Cut, i) => (
        <Sequence
          key={i}
          from={Math.round(CUT_TIMES[i] * fps)}
          durationInFrames={Math.round((CUT_TIMES[i + 1] - CUT_TIMES[i]) * fps)}
        >
          <Cut />
        </Sequence>
      ))}
      <SubtitleLayer subtitles={subtitles} />
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
