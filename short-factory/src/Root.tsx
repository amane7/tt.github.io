import React from 'react';
import { Composition } from 'remotion';
import { MentalHealth90s } from './MentalHealth90s';

// 90.0秒 / 30fps / 1920x1080(編集指示書 §1)
export const RemotionRoot: React.FC = () => (
  <Composition
    id="mental-health-90s"
    component={MentalHealth90s}
    durationInFrames={90 * 30}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      // audioSrc: 'voice.m4a', // TTS収録後に有効化
      // bgmSrc: 'bgm.m4a',
      // aiVoiceLabel: '音声はAIで生成しています',
    }}
  />
);
