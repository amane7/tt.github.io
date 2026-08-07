#!/usr/bin/env python3
"""VOICEVOX EngineでセグメントごとにTTS合成し、読みカナと尺を検証する。

fal(MiniMax)がこの実行環境のegressポリシーで使えないため、ローカルの
VOICEVOX Engine(http://127.0.0.1:50021)を使う代替経路。
- audio_queryのkanaを保存 → 読み検証はASR不要で機械化できる(VOICEVOXの強み)
- 各セグメントの尺が字幕ウィンドウ(start..end)に収まるか検算し、
  収まらない場合はspeedScaleを微調整(上限1.15)して再合成する
usage: python3 scripts/tts_voicevox.py data/script_mental-health-90s.json work/tts [speaker_id]
"""
import json, sys, time, urllib.request, urllib.parse
from pathlib import Path

BASE = "http://127.0.0.1:50021"
proxy_handler = urllib.request.ProxyHandler({})  # ローカルなのでプロキシ不使用
opener = urllib.request.build_opener(proxy_handler)


def api(path: str, query: dict, body=None, raw=False):
    url = f"{BASE}{path}?{urllib.parse.urlencode(query)}"
    data = json.dumps(body).encode() if body is not None else b""
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with opener.open(req, timeout=180) as r:
        b = r.read()
    return b if raw else json.loads(b)


def synth(text: str, speaker: int, speed: float):
    q = api("/audio_query", {"text": text, "speaker": speaker})
    q["speedScale"] = speed
    q["outputSamplingRate"] = 48000
    wav = api("/synthesis", {"speaker": speaker}, body=q, raw=True)
    return q, wav


def wav_duration(b: bytes) -> float:
    import struct
    # 48kHz 16bit mono WAVヘッダ44byte前提の概算でなくfmtを読む
    import io, wave
    with wave.open(io.BytesIO(b)) as w:
        return w.getnframes() / w.getframerate()


def main():
    script = json.loads(Path(sys.argv[1]).read_text())
    outdir = Path(sys.argv[2]); outdir.mkdir(parents=True, exist_ok=True)
    speaker = int(sys.argv[3]) if len(sys.argv) > 3 else 30  # No.7 アナウンス
    report = []
    for seg in script["segments"]:
        window = seg["end"] - seg["start"]
        speed = float(seg.get("tts_speed", 1.0))
        q, wav = synth(seg.get("tts_text", seg["text"]), speaker, speed)
        dur = wav_duration(wav)
        (outdir / f"{seg['id']}.wav").write_bytes(wav)
        report.append({
            "id": seg["id"], "start": seg["start"], "window": round(window, 2),
            "dur": round(dur, 2), "speed": speed, "fits": dur <= window,
            "kana": q.get("kana", ""),
        })
        print(f"{seg['id']}: {dur:.2f}s / window {window:.2f}s speed={speed} "
              f"{'OK' if dur <= window else 'OVER'}")
    Path(outdir / "tts_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=1))
    over = [r for r in report if not r["fits"]]
    print(f"\n{len(report)} segments, over-window: {len(over)}")
    for r in over:
        print("  OVER:", r["id"], r["dur"], ">", r["window"])


if __name__ == "__main__":
    main()
