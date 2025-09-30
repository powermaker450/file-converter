import MainView from "../components/MainView";
import { Button, Grid, Link } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useFilePicker } from "use-file-picker";
import { useEffect, useState, type JSX } from "react";
import { useAlert } from "../contexts/AlertProvider";
import { useFFmpeg } from "../contexts/FFmpegProvider";
import { fetchFile } from "@ffmpeg/util";
import FilePreview from "../components/FilePreview";
import CRFSlider from "../components/CRFSlider";

const Video = () => {
  const notice = useAlert();
  const { ffmpeg } = useFFmpeg();
  const [crf, setCrf] = useState(32);
  const [download, setDownload] = useState<string>();

  const picker = useFilePicker({
    multiple: false,
    accept: "video/*",
  });

  const video = picker.plainFiles.at(0);
  const videoUrl = video && URL.createObjectURL(video);

  const execute = async () => {
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
        "output.mp4",
      ]);
      const file = await ffmpeg.readFile("output.mp4");
      setDownload(
        URL.createObjectURL(new Blob([file.buffer], { type: video.type })),
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        notice.error(err.message);
      }
    }
  };

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
          <CRFSlider crf={crf} setCrf={setCrf} />
          <Button variant="contained" onClick={execute}>
            Execute
          </Button>

          {download && <Link href={download}>TO</Link>}
        </Grid>
      </Grid>
    );
  }

  return <MainView>{content}</MainView>;
};

export default Video;
