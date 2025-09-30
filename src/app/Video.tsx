import MainView from "../components/MainView";
import { Button, Grid } from "@mui/material";
import { CloudUpload, Hd, Speaker } from "@mui/icons-material";
import { useFilePicker } from "use-file-picker";
import { useCallback, useEffect, useState, type JSX } from "react";
import { useAlert } from "../contexts/AlertProvider";
import { useFFmpeg } from "../contexts/FFmpegProvider";
import { fetchFile } from "@ffmpeg/util";
import FilePreview from "../components/FilePreview";
import ValueSlider from "../components/ValueSlider";

const Video = () => {
  const notice = useAlert();
  const { ffmpeg } = useFFmpeg();

  const [crf, setCrf] = useState(32);
  const [audioQuality, setAudioQuality] = useState(128);
  const [downloadUrl, setDownloadUrl] = useState<string>();

  const picker = useFilePicker({
    multiple: false,
    accept: "video/*",
  });

  const video = picker.plainFiles.at(0);
  const videoUrl = video && URL.createObjectURL(video);

  const execute = useCallback(async () => {
    if (!video) {
      notice.error("No video selected");
      return;
    }

    try {
      await ffmpeg.exec([
        "-i",
        video.name,
        "-crf",
        crf.toString(),
        "-b:a",
        `${audioQuality}k`,
        "output.mp4",
      ]);
      const file = await ffmpeg.readFile("output.mp4");
      setDownloadUrl(URL.createObjectURL(new Blob([file])));
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        notice.error(err.message);
      }
    }
  }, [video, crf, audioQuality, notice, setDownloadUrl]);

  useEffect(() => {
    async function set() {
      if (!videoUrl) {
        return;
      }

      await ffmpeg.writeFile(video.name, await fetchFile(videoUrl));
    }

    set();
  }, [videoUrl]);

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
          Upload video
        </Button>
      </MainView>
    );
  } else {
    content = (
      <Grid container spacing={5}>
        <FilePreview file={video} remove={picker.clear} />

        <Grid container direction="column" justifyContent="space-between">
          <ValueSlider
            title="CRF"
            icon={<Hd />}
            value={crf}
            setValue={setCrf}
            min={4}
            max={63}
          />

          <ValueSlider
            title="Audio Quality"
            icon={<Speaker />}
            value={audioQuality}
            setValue={setAudioQuality}
            min={1}
            max={320}
          />

          <Button variant="contained" onClick={execute}>
            Execute
          </Button>

          {downloadUrl && <video controls src={downloadUrl} />}
        </Grid>
      </Grid>
    );
  }

  return <MainView>{content}</MainView>;
};

export default Video;
