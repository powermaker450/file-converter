import MainView from "../components/MainView";
import { Box, Button, Grid } from "@mui/material";
import {
  AutoAwesomeMotion,
  CloudUpload,
  Hd,
  Speaker,
} from "@mui/icons-material";
import { useFilePicker } from "use-file-picker";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type JSX,
} from "react";
import { useAlert } from "../contexts/AlertProvider";
import { useFFmpeg } from "../contexts/FFmpegProvider";
import { fetchFile } from "@ffmpeg/util";
import FilePreview from "../components/FilePreview";
import ValueSlider from "../components/ValueSlider";
import type { ProgressEventCallback } from "@ffmpeg/ffmpeg";
import ProgressBar from "../components/ProgressBar";
import { VideoExtension } from "../util/VideoExtension";
import EnumSelector from "../components/EnumSelector";

interface VideoStyleSheet {
  filePreview: ComponentProps<typeof FilePreview>["sx"];
  videoBox: ComponentProps<typeof Box>["sx"];
}

const Video = () => {
  const notice = useAlert();
  const { ffmpeg } = useFFmpeg();

  const [crf, setCrf] = useState(32);
  const [audioQuality, setAudioQuality] = useState(128);
  const [fps, setFps] = useState(30);
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);
  const [videoExtension, setVideoExtension] = useState<VideoExtension | null>(
    null,
  );

  const [downloadUrl, setDownloadUrl] = useState<string>();

  const picker = useFilePicker({
    multiple: false,
    accept: "video/*",
  });

  const video = useMemo(() => picker.plainFiles.at(0), [picker.plainFiles]);

  const execute = useCallback(async () => {
    if (!video) {
      notice.error("No video selected");
      return;
    }

    try {
      setConverting(true);
      downloadUrl && setDownloadUrl(undefined);

      const lastIndexOfDot = video.name.lastIndexOf(".");
      const nameWithoutExtension = video.name.slice(0, lastIndexOfDot);
      const extension = video.name.slice(lastIndexOfDot);
      const newFileName = videoExtension
        ? nameWithoutExtension + videoExtension
        : `${nameWithoutExtension}-modified${extension}`;

      await ffmpeg.exec([
        "-i",
        video.name,
        "-crf",
        crf.toString(),
        "-b:a",
        `${audioQuality}k`,
        "-vf",
        `fps=${fps}`,
        newFileName,
      ]);
      const file = await ffmpeg.readFile(newFileName);
      setDownloadUrl(URL.createObjectURL(new Blob([file])));
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        notice.error(err.message);
      }
    } finally {
      setConverting(false);
      setProgress(0);
    }
  }, [
    video,
    crf,
    fps,
    audioQuality,
    notice,
    downloadUrl,
    setDownloadUrl,
    setConverting,
    setProgress,
    videoExtension,
  ]);

  useEffect(() => {
    const progressListener: ProgressEventCallback = e => {
      console.warn("[FFMPEG Progress]", e.progress);
      setProgress(e.progress * 100);
    };
    ffmpeg.on("progress", progressListener);

    return () => {
      ffmpeg.off("progress", progressListener);
    };
  }, []);

  useEffect(() => {
    async function set() {
      if (!video) {
        return;
      }

      await ffmpeg.writeFile(
        video.name,
        await fetchFile(URL.createObjectURL(video)),
      );
    }

    set();
  }, [video]);

  const styles: VideoStyleSheet = {
    filePreview: {
      alignSelf: "center",
    },
    videoBox: { width: "50%", alignSelf: "center" },
  };

  let content: JSX.Element;

  if (!picker.filesContent.length) {
    content = (
      <MainView>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          disabled={picker.loading}
          onClick={picker.openFilePicker}
        >
          Select video
        </Button>
      </MainView>
    );
  } else {
    content = (
      <Grid container spacing={5} justifyContent="space-evenly">
        <FilePreview
          sx={styles.filePreview}
          file={video}
          disableRemove={converting}
          remove={picker.clear}
        />

        <Grid container direction="column" justifyContent="space-evenly">
          <ValueSlider
            title="CRF"
            icon={<Hd />}
            value={crf}
            setValue={setCrf}
            min={4}
            max={63}
            disabled={converting}
          />

          <ValueSlider
            title="Audio Quality"
            icon={<Speaker />}
            value={audioQuality}
            setValue={setAudioQuality}
            min={1}
            max={320}
            disabled={converting}
          />

          <ValueSlider
            title="FPS"
            icon={<AutoAwesomeMotion />}
            value={fps}
            setValue={setFps}
            min={5}
            max={60}
            step={5}
            disabled={converting}
          />

          <EnumSelector
            value={videoExtension}
            setValue={setVideoExtension}
            enumerable={VideoExtension}
          />

          {converting ? (
            <ProgressBar sx={{ alignSelf: "center" }} value={progress} />
          ) : (
            <Button variant="contained" onClick={execute}>
              Execute
            </Button>
          )}
        </Grid>

        <Box sx={styles.videoBox}>
          {downloadUrl && (
            <video
              style={{ width: "100%" }}
              controls
              autoPlay
              src={downloadUrl}
            />
          )}
        </Box>
      </Grid>
    );
  }

  return <MainView>{content}</MainView>;
};

export default Video;
