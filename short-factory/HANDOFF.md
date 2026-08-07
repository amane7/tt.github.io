# 引き継ぎ: メンタルヘルス90秒動画 — TTS工程から再開

`/short-video-maker` スキルのパイプラインで制作中。絵コンテ・原稿類は `work/` に
コピーして使っていた(git外なので、必要なら再アップロードしてもらう。字幕SRT・
絵コンテ・ナレーション原稿・編集指示書の4点)。

## 完了済み

- Remotionプロジェクト一式(このディレクトリ)。16:9 / 1920x1080 / 30fps / 90秒
- 絵コンテ8カットをコード実装(`src/cuts.tsx`)。静止画QC全カット通過・tsc通過
- 無音ドラフトMP4のレンダ確認済み(`npm run render` 相当)
- 台本リント通過: `work/script_mental_health_90s.json`(下記で再生成可)
- 環境: ffmpeg / openai-whisper / fonts-noto-cjk を apt・pip で導入
- Remotionのブラウザ: 公式配布元(remotion.media)がブロックされるため
  Chrome for Testing の chrome-headless-shell を使用:
  `curl -o chs.zip https://storage.googleapis.com/chrome-for-testing-public/131.0.6778.204/linux64/chrome-headless-shell-linux64.zip`
  → work/ に展開し `--browser-executable=work/chrome-headless-shell-linux64/chrome-headless-shell`

## ブロッカー(このセッションで解決できなかった)

fal API(queue.fal.run / fal.media)がネットワークポリシーで403。
ユーザーは許可リストに追加済みと言っているが、実行中コンテナに反映されなかった。
**新セッションの起動時に反映されているはず — 最初に疎通確認をすること:**
`curl -sS -o /dev/null -w "%{http_code}" https://queue.fal.run`(000以外なら到達)

## 再開手順(TTS工程 = スキル工程1-B)

1. ユーザーに fal APIキーをもらい `assets/.fal_key` に保存(git外。コミット禁止)
2. 台本16セグメント: `work/script_mental_health_90s.json`
   (無ければ `src/cues/mental-health-90s.ts` の字幕とナレーション原稿から復元。
   リント済み・読み事故リスクなし)
3. ボイス試験: `FAL_KEY=$(cat assets/.fal_key) python3 scripts/fal_helpers.py tts "<試験文>" work/tts_test.mp3 --voice-id Deep_Voice_Man`
   - MiniMaxプリセット(クローンではない)。落ち着いた低め男性=Deep_Voice_Man を第一候補に、
     whisperでASR確認+ユーザーに試聴してもらい確定
4. 16セグメント個別生成 → 各ファイルの実測秒数を ffprobe で記録
5. タイムライン組み: カット境界 `CUT_TIMES=[0,10,20,30,40,55,70,85,90]` に合わせ
   各カット先頭+0.4sから配置、セグメント間0.4-0.5s
   - CUT5(40-55s・4セグメント94字)が唯一あふれやすい。あふれたら --speed 1.05-1.1 で再生成
   - 収録ディレクション(間の指定): 「その前に。」後0.5s / 「ありません。」後0.5s / 0.4s / 最終文前0.3s
6. 機械検収: `python3 scripts/asr_qc.py`(全文diff+数字照合)→
   `python3 scripts/declick_pauses.py scan/fix` → EQ(SKILL.md工程1-B手順5の標準チェーン)
   → loudnorm(I=-16)→ **再scan** → `public/voice.m4a`
7. `src/cues/mental-health-90s.ts` の字幕timingを実配置に合わせ更新
8. `src/Root.tsx` の defaultProps に audioSrc: 'voice.m4a' と
   aiVoiceLabel: '音声はAIで生成しています' を有効化
9. BGM: `python3 scripts/fal_helpers.py bgm "calm acoustic minimal, felt piano, marimba, warm, corporate training, no drums" work/bgm_loop.wav --seconds 30`
   → ffmpegで90秒にループ+フェード → `public/bgm.m4a`、Root.tsxで bgmSrc 有効化(音量0.16目安)
   - 編集指示書§6: 0:40-0:55はBGM-2dB(ナレーション優先)、最後は明るく終止
10. 本番レンダ → 検収: 尺90.0s / LUFS -16〜-14 / TP≤-1(ffmpeg loudnorm print_format=json で実測)
    / 静止画QC(フック頭・各カット切替・CTA)
11. キャラ素材が届いたら `src/parts.tsx` の Person をリグ差し替え(スキル工程2)

## 注意

- 同意誘導の禁止事項(絵コンテ「禁止」欄・編集指示書§9)を最終確認すること
- 完成後、ユーザーにfal APIキーのローテーションを勧める(チャット経由で受け渡したため)
