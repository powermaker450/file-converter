import { LinearProgress, Stack, Typography } from "@mui/material";
import type { ComponentProps } from "react";

type StackProps = ComponentProps<typeof Stack>;

interface ProgressBarProps {
  value: number;
  sx?: StackProps["sx"];
}

interface ProgressBarStyleSheet {
  stack: StackProps["sx"];
}

const ProgressBar = ({ value, sx }: ProgressBarProps) => {
  const styles: ProgressBarStyleSheet = {
    stack: {
      width: 150,
      ...sx,
    },
  };

  return (
    <Stack spacing={1} sx={styles.stack}>
      <LinearProgress variant="determinate" value={value} />
      <Typography variant="body1">{value.toFixed(0)}%</Typography>
    </Stack>
  );
};

export default ProgressBar;
