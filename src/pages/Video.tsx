import MainView from "../components/MainView";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useFilePicker } from "use-file-picker";
import { useEffect } from "react";
import { FileAmountLimitValidator } from "use-file-picker/validators";
import { useAlert } from "../contexts/AlertProvider";

const Video = () => {
  const notice = useAlert();

  const picker = useFilePicker({
    validators: [new FileAmountLimitValidator({ max: 1 })],
  });

  useEffect(() => {
    const first = picker.errors.at(0);
    if (!first) {
      return;
    }
    switch (first.name) {
      case "FileAmountLimitError":
        notice.error("One file at a time!");
        break;
      default:
        notice.error(first.name);
    }
  }, [picker.errors]);

  return (
    <MainView sx={{ padding: 5 }}>
      <Button
        variant="contained"
        startIcon={<CloudUpload />}
        disabled={picker.loading}
        onClick={picker.openFilePicker}
      >
        Upload files
      </Button>
    </MainView>
  );
};

export default Video;
