import { Box, Slider, Stack, Typography } from "@mui/material";
import { Hd } from "@mui/icons-material";

interface CRFSliderProps {
  crf: number;
  setCrf: (crf: number) => void;
}

const CRFSlider = ({ crf, setCrf }: CRFSliderProps) => {
  const handleChange = (_: Event, newCrf: number) => {
    setCrf(newCrf);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Typography>CRF</Typography>

      <Stack spacing={2} direction="row">
        <Hd />

        <Slider
          value={crf}
          onChange={handleChange}
          min={4}
          max={63}
          valueLabelDisplay="auto"
        />
      </Stack>
    </Box>
  );
};

export default CRFSlider;
