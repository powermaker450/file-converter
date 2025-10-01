import { Box, Slider, Stack, Typography } from "@mui/material";
import type { JSX } from "react";

interface ValueSliderProps {
  title: string;
  icon: JSX.Element;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  setValue: (newValue: number) => void;
}

export default function ValueSlider({
  title,
  icon,
  min,
  max,
  step,
  value,
  setValue,
}: ValueSliderProps) {
  const handleChange = (_: Event, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Typography>{title}</Typography>

      <Stack spacing={2} direction="row">
        {icon}

        <Slider
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          valueLabelDisplay="auto"
        />
      </Stack>
    </Box>
  );
}
