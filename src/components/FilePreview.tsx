import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import type { ComponentProps } from "react";

interface FilePreviewProps {
  file: File | undefined;
  sx?: ComponentProps<typeof Card>["sx"];
  disableRemove?: boolean;
  remove: () => void;
}

const FilePreview = ({ file, sx, disableRemove, remove }: FilePreviewProps) => {
  return (
    <Card sx={sx}>
      <CardContent>
        <Typography variant="h5">{file?.name}</Typography>
        <Typography variant="h6">
          {((file?.size ?? 0) / 1_000_000).toFixed(2) + "MB"}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          onClick={remove}
          disabled={disableRemove}
          color="error"
          aria-label={`Remove ${file?.name}`}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default FilePreview;
