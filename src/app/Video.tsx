import MainView from "../components/MainView";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useFilePicker } from "use-file-picker";
import { useEffect, type ComponentProps, type JSX } from "react";
import { useAlert } from "../contexts/AlertProvider";
import { useFFmpeg } from "../contexts/FFmpegProvider";
import { fetchFile } from "@ffmpeg/util";

type BoxStyle = ComponentProps<typeof Box>["sx"];

interface VideoStyleSheet {
  videoBox: BoxStyle;
  videoPlayer: object;
}

const Video = () => {
  const notice = useAlert();
  const { ffmpeg, loading } = useFFmpeg();

  const picker = useFilePicker({
    multiple: false,
    accept: "video/*",
  });

  const video = picker.plainFiles.at(0);
  const videoUrl = video && URL.createObjectURL(video);

  useEffect(() => {
    async function set() {
      if (!videoUrl) {
        return;
      }

      await ffmpeg.writeFile(video.name, await fetchFile(videoUrl));
    }

    set();
  }, [videoUrl]);

  const execute = async () => {
    try {
      if (!video) {
        throw new Error("No video");
      }

      const data = await ffmpeg.readFile("output.mp4");
      console.log(data);
    } catch (err) {
      if (err instanceof Error) {
        notice.error(err.message);
      }
    }
  };

  const styles: VideoStyleSheet = {
    videoBox: {
      width: "50%",
    },
    videoPlayer: {
      width: "100%",
    },
  };

  let content: JSX.Element;

  if (loading) {
    content = (
      <MainView sx={{ gap: 2 }}>
        <CircularProgress />
        <Typography>Loading wasm...</Typography>
      </MainView>
    );
  } else if (!picker.filesContent.length) {
    content = (
      <MainView>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          disabled={picker.loading}
          onClick={picker.openFilePicker}
        >
          Upload video
        </Button>
      </MainView>
    );
  } else {
    content = (
      <Grid container spacing={5}>
        <Card sx={styles.videoBox}>
          <CardContent>
            <Typography variant="h5">{video?.name}</Typography>
            <Typography variant="h6">{`${(video?.size ?? 0 / 1_000_000).toFixed(2)} MB`}</Typography>
          </CardContent>

          <CardActions>
            <Button onClick={picker.clear} color="error">
              Remove
            </Button>
          </CardActions>
        </Card>

        <Button onClick={execute}>Execute</Button>
      </Grid>
    );
  }

  return <MainView>{content}</MainView>;
};

export default Video;
