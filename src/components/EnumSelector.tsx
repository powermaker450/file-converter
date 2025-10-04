import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { type ComponentProps } from "react";

type BoxProps = ComponentProps<typeof Box>;
type ObjectWithStrings = Record<string, string>;

interface EnumSelectorProps<T extends ObjectWithStrings> {
  value: T[keyof T] | null;
  setValue: (value: T[keyof T]) => void;
  enumerable: T;
  disabled?: boolean;
  sx?: BoxProps["sx"];
}

interface EnumSelectorStyleSheet {
  box: BoxProps["sx"];
}

export default function EnumSelector<T extends ObjectWithStrings>({
  value,
  setValue,
  enumerable,
  disabled,
  sx,
}: EnumSelectorProps<T>) {
  type ValueOfT = T[keyof T];

  const handleChange = (e: SelectChangeEvent<ValueOfT>) => {
    setValue(e.target.value as ValueOfT);
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
          value={value ?? ""}
          label="Video Type"
          onChange={handleChange}
          disabled={disabled}
        >
          {Object.entries(enumerable).map(([key, value]) => (
            <MenuItem value={value}>{key}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
