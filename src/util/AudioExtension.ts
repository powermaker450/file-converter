type Key = "MP3" | "M4A" | "OPUS" | "WAV" | "FLAC";
type Value = ".mp3" | ".m4a" | ".opus" | ".wav" | ".flac";

export const AudioExtension: Record<Key, Value> = {
  MP3: ".mp3",
  M4A: ".m4a",
  OPUS: ".opus",
  WAV: ".wav",
  FLAC: ".flac",
};

export type AudioExtension = Value;
