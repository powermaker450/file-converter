import MainView from "../components/MainView";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { CloudUpload, VideocamRounded } from "@mui/icons-material";
import { useFilePicker } from "use-file-picker";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import InputSlider from "../components/InputSlider";
import { FFmpeg, type ProgressEventCallback } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useAlert } from "../contexts/AlertProvider";
import wasm from "@ffmpeg/core/wasm?url";
import core from "@ffmpeg/core?url";

type BoxStyle = ComponentProps<typeof Box>["sx"];

interface VideoStyleSheet {
  mainView: ComponentProps<typeof MainView>["sx"];
  videoBox: BoxStyle;
  videoPlayer: object;
}

const Video = () => {
  const notice = useAlert();

  const { current: ffmpeg } = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement>(null);

  const [loading, setLoading] = useState(true);
  const [crf, setCrf] = useState(32);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressListener: ProgressEventCallback = e =>
      setProgress(e.progress);

    ffmpeg.on("progress", progressListener);
    ffmpeg.on("log", log => {
      console.log(log);
    });

    return () => {
      ffmpeg.off("progress", progressListener);
    };
  }, []);

  useEffect(() => {
    async function load() {
      try {
        console.log("Loading wasm");
        await ffmpeg.load({
          coreURL: core,
          wasmURL: wasm,
        });
        console.log("Finished loading wasm");
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          notice.error(err.message);
        }
      }
    }

    load();
  }, []);

  const picker = useFilePicker({
    multiple: false,
    accept: "video/*",
  });

  const video = picker.plainFiles.at(0);
  const videoUrl = video && URL.createObjectURL(video);

  useEffect(() => {
    async function set() {
      if (!videoUrl || !videoRef.current) {
        return;
      }

      videoRef.current.src = videoUrl;
      await ffmpeg.writeFile(video.name, await fetchFile(videoUrl));
    }

    set();
  }, [videoUrl]);

  const execute = async () => {
    try {
      if (!video || !videoRef.current) {
        throw new Error("No video");
      }

      await ffmpeg.exec([
        "-i",
        video.name,
        "-crf",
        crf.toString(),
        "output.mp4",
      ]);
      const data = await ffmpeg.readFile("output.mp4");
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" }),
      );
    } catch (err) {
      if (err instanceof Error) {
        notice.error(err.message);
      }
    }
  };

  const styles: VideoStyleSheet = {
    mainView: {
      padding: 5,
      width: "85%",
      margin: "auto",
    },
    videoBox: {
      width: "50%",
    },
    videoPlayer: {
      width: "100%",
    },
  };

  if (loading) {
    return (
      <Grid container sx={{ placeItems: "center" }}>
        <CircularProgress />
        <Typography>Loading wasm...</Typography>
      </Grid>
    );
  }

  return (
    <MainView sx={styles.mainView}>
      {!picker.filesContent.length ? (
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          disabled={picker.loading}
          onClick={picker.openFilePicker}
        >
          Upload files
        </Button>
      ) : undefined}

      {video ? (
        <Grid container spacing={5}>
          <Card sx={styles.videoBox}>
            <CardContent>
              <Typography variant="h5">{video.name}</Typography>
              <Typography variant="h6">{`${(video.size / 1_000_000).toFixed(2)} MB`}</Typography>

              <video controls style={styles.videoPlayer} ref={videoRef} />
            </CardContent>

            <CardActions>
              <Button onClick={picker.clear} color="error">
                Remove
              </Button>
            </CardActions>
          </Card>

          <InputSlider value={crf} setValue={setCrf} />
          <Button onClick={execute}>Execute</Button>

          <Box sx={{ width: "100%" }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        </Grid>
      ) : undefined}
    </MainView>
  );
};

export default Video;
