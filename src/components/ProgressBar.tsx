import { Box, LinearProgress } from "@mui/material";
import type { ComponentProps } from "react";

type BoxProps = ComponentProps<typeof Box>;

interface ProgressBarProps {
  value: number;
  sx?: BoxProps["sx"];
}

interface ProgressBarStyleSheet {
  box: BoxProps["sx"];
}

const ProgressBar = ({ value, sx }: ProgressBarProps) => {
  const styles: ProgressBarStyleSheet = {
    box: {
      width: 100,
      ...sx,
    },
  };

  return (
    <Box sx={styles.box}>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  );
};

export default ProgressBar;
