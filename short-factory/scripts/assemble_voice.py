#!/usr/bin/env python3
"""TTSセグメントを90秒タイムラインへ配置し、1本の声トラックを組み立てる。

配置規則:
- 原則は台本の予定start。前セグメントと重なる場合は prev_end+0.15 へ後ろ倒し
- カット境界(CUT_TIMES)を末尾セグメントが超えないよう、超える場合はカット内で前倒し
- cut2-2は14.2へ・cut5は40.4から順送り(実測尺での再同期)
- 字幕タイミング: 音声より0.10s早出し・0.12s遅消し(2〜4フレーム規則)
出力: work/timeline.json(音声start/end・字幕start/end)と work/voice_raw.wav
"""
import json, subprocess
from pathlib import Path

CUT_TIMES = [0, 10, 20, 30, 40, 55, 70, 85, 90]
GAP = 0.15
TOTAL = 90.0

script = json.loads(Path("data/script_mental-health-90s.json").read_text())
report = {r["id"]: r for r in json.loads(Path("work/tts/tts_report.json").read_text())}

# カットごとにグループ化
segs = script["segments"]
timeline = []
prev_end = 0.0
overrides = {"cut2-2": 14.2, "cut5-1": 40.3}
for seg in segs:
    sid = seg["id"]
    cut_no = int(sid[3])
    boundary = CUT_TIMES[cut_no]
    dur = report[sid]["dur"]
    start = overrides.get(sid, seg["start"])
    # cut5は順送り(カード同期のためカード境界=セグメントstart)
    # cut5は順送り(カード同期のためカード境界=セグメントstart)。
    # セグメントwavに前後0.1sずつの無音が含まれるため、詰めても間は保たれる
    gap = 0.05 if cut_no == 5 else GAP
    if cut_no == 5 and sid != "cut5-1":
        start = prev_end + gap
    if start < prev_end + gap:
        start = prev_end + gap
    # カット境界超過なら前倒し(カット頭+0.2まで)
    if start + dur > boundary - 0.05:
        start = max(CUT_TIMES[cut_no - 1] + 0.2, boundary - 0.05 - dur)
        if start < prev_end + GAP:
            raise SystemExit(f"{sid}: カット{cut_no}に収まらない (need {start}, prev_end {prev_end})")
    end = start + dur
    timeline.append({
        "id": sid, "audio_start": round(start, 3), "audio_end": round(end, 3),
        "sub_start": round(max(0, start - 0.10), 2),
        "sub_end": round(min(TOTAL, end + 0.12), 2),
        "text": seg["text"],
    })
    prev_end = end

# 字幕の重なり解消(次の早出しと前の遅消しがぶつかったら前を詰める)
for a, b in zip(timeline, timeline[1:]):
    if a["sub_end"] > b["sub_start"] - 0.04:
        a["sub_end"] = round(b["sub_start"] - 0.04, 2)

Path("work/timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1))
for t in timeline:
    print(f"{t['id']}: audio {t['audio_start']:6.2f}-{t['audio_end']:6.2f}  sub {t['sub_start']:6.2f}-{t['sub_end']:6.2f}")

# ffmpegで組み立て: 各wavをadelayで配置しamix(normalize=0)
inputs, delays = [], []
for i, t in enumerate(timeline):
    inputs += ["-i", f"work/tts/{t['id']}.wav"]
    ms = int(round(t["audio_start"] * 1000))
    delays.append(f"[{i}:a]adelay={ms}|{ms}[d{i}]")
n = len(timeline)
fc = ";".join(delays) + ";" + "".join(f"[d{i}]" for i in range(n)) + \
     f"amix=inputs={n}:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[out]"
cmd = ["ffmpeg", "-y", "-loglevel", "error"] + inputs + \
      ["-filter_complex", fc, "-map", "[out]", "-ar", "48000", "-ac", "1", "work/voice_raw.wav"]
subprocess.run(cmd, check=True)
print("\nwrote work/voice_raw.wav")
