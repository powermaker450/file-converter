import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useState, type ComponentProps } from "react";

type BoxProps = ComponentProps<typeof Box>;

interface EnumSelectorProps<T extends object> {
  enumerable: T;
  sx?: BoxProps["sx"];
}

interface EnumSelectorStyleSheet {
  box: BoxProps["sx"];
}

export default function EnumSelector<T extends object>({
  enumerable,
  sx,
}: EnumSelectorProps<T>) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (e: SelectChangeEvent) => {
    setSelectedValue(e.target.value);
  };

  const styles: EnumSelectorStyleSheet = {
    box: {
      minWidth: 150,
      ...sx,
    },
  };

  return (
    <Box sx={styles.box}>
      <FormControl fullWidth>
        <InputLabel>Video Type</InputLabel>
        <Select
          value={selectedValue}
          label="Video Type"
          onChange={handleChange}
        >
          {Object.entries(enumerable).map(([key, value]) => (
            <MenuItem value={value}>{key}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
