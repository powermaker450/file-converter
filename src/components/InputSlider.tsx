import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { Hd } from "@mui/icons-material";
import { Input } from "@mui/material";

interface InputSliderProps {
  value: number;
  setValue: (num: number) => void;
}

const InputSlider = ({ value, setValue }: InputSliderProps) => {
  const handleSliderChange = (_: Event, newValue: number) => {
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(event.target.value);

    if (num !== num) {
      return setValue(4);
    }

    if (num < 4) {
      return setValue(4);
    }

    if (num > 63) {
      return setValue(63);
    }

    setValue(num);
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        CRF
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid>
          <Hd />
        </Grid>
        <Grid size="grow">
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={4}
            max={63}
          />
        </Grid>
        <Grid>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            inputProps={{
              min: 4,
              max: 63,
              type: "number",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InputSlider;
