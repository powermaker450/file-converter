type Key = "MP4" | "MKV" | "WEBM";
type Value = ".mp4" | ".mkv" | ".webm";

export const VideoExtension: Record<Key, Value> = {
  MP4: ".mp4",
  MKV: ".mkv",
  WEBM: ".webm",
};

export type VideoExtension = Value;
