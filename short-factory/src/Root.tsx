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
      audioSrc: 'voice.m4a', // VOICEVOX No.7「アナウンス」・EQ+loudnorm済み(work/参照)
      // bgmSrc: 'bgm.m4a',
      aiVoiceLabel: '音声はAIで生成しています(VOICEVOX:No.7)',
      // 水彩絵コンテ(2026-08-07受領・7枚)。CUT7のみ未受領のためコード描画
      storyboard: {
        1: 'storyboard/cut1.png',
        2: 'storyboard/cut2.png',
        3: 'storyboard/cut3.png',
        4: 'storyboard/cut4.png',
        5: 'storyboard/cut5.png',
        6: 'storyboard/cut6.png',
        8: 'storyboard/cut8.png',
      },
    }}
  />
);
