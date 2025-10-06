import { useFilePicker } from "use-file-picker";
import { useEffect, useMemo, useState, type JSX } from "react";
import { Box, Button, Grid } from "@mui/material";
import { CloudUpload, Speaker } from "@mui/icons-material";
import { useAlert } from "../contexts/AlertProvider";
import { useFFmpeg } from "../contexts/FFmpegProvider";
import MainView from "../components/MainView";
import type { ProgressEventCallback } from "@ffmpeg/ffmpeg";
import FilePreview from "../components/FilePreview";
import ValueSlider from "../components/ValueSlider";
import ProgressBar from "../components/ProgressBar";
import { AudioExtension } from "../util/AudioExtension";
import EnumSelector from "../components/EnumSelector";

const Audio = () => {
  const notice = useAlert();
  const picker = useFilePicker({
    multiple: false,
    accept: ["opus", "mpeg", "ogg"].map(v => `audio/${v}`),
  });
  const { ffmpeg } = useFFmpeg();

  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string>();
  const [audioQuality, setAudioQuality] = useState(128);
  const [audioExtension, setAudioExtension] = useState<AudioExtension | null>(
    null,
  );

  const audio = useMemo(() => picker.plainFiles.at(0), [picker.plainFiles]);
  const audioIsMp3 = audio ? audio.name.endsWith(".mp3") : false;

  const execute = async () => {
    if (!audio) {
      notice.error("No audio file selected");
      return;
    }

    try {
      setConverting(true);
      downloadUrl && setDownloadUrl(undefined);

      const lastIndexOfDot = audio.name.lastIndexOf(".");
      const nameWithoutExtension = audio.name.slice(0, lastIndexOfDot);
      const oldExtension = audio.name.slice(lastIndexOfDot);
      const newFileName = audioExtension
        ? nameWithoutExtension + audioExtension
        : `${nameWithoutExtension}-modified${oldExtension}`;

      const mp3Opts = audioIsMp3 ? ["-b:a", `${audioQuality}k`] : [];

      await ffmpeg.exec(["-i", audio.name, ...mp3Opts, newFileName]);

      const file = await ffmpeg.readFile(newFileName);
      setDownloadUrl(
        URL.createObjectURL(
          new Blob([file], {
            type: `audio/${oldExtension.slice(oldExtension.indexOf(".") + 1)}`,
          }),
        ),
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        notice.error(err.message);
      }
    } finally {
      setConverting(false);
    }
  };

  useEffect(() => {
    const progressListener: ProgressEventCallback = e => {
      console.warn("[FFMPEG Progress]", e.progress);
      setProgress(e.progress);
    };

    ffmpeg.on("progress", progressListener);

    return () => {
      ffmpeg.off("progress", progressListener);
    };
  }, []);

  useEffect(() => {
    async function set() {
      if (!audio) {
        return;
      }
      const file = URL.createObjectURL(audio);
      console.log(file);

      await ffmpeg.writeFile(audio.name, file);
    }

    set();
  }, [audio]);

  let content: JSX.Element;

  if (!picker.plainFiles.length) {
    content = (
      <Box>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          disabled={picker.loading}
          onClick={picker.openFilePicker}
        >
          Select audio file
        </Button>
      </Box>
    );
  } else {
    content = (
      <Grid container spacing={5} justifyContent="space-evenly">
        <FilePreview
          file={audio}
          remove={picker.clear}
          disableRemove={converting}
        />

        <Grid container direction="column" justifyContent="space-evenly">
          <ValueSlider
            title="Audio Quality"
            icon={<Speaker />}
            value={audioQuality}
            setValue={setAudioQuality}
            min={1}
            max={320}
            disabled={converting || !audioIsMp3}
          />

          <EnumSelector
            label="Audio Type"
            enumerable={AudioExtension}
            value={audioExtension}
            setValue={setAudioExtension}
            disabled={converting}
          />

          {converting ? (
            <ProgressBar sx={{ alignSelf: "center" }} value={progress} />
          ) : (
            <Button variant="contained" onClick={execute}>
              Execute
            </Button>
          )}
        </Grid>
      </Grid>
    );
  }

  return <MainView>{content}</MainView>;
};

export default Audio;
