import { Box } from "@mui/material";
import type { ComponentProps, ReactNode } from "react";

type BoxProps = ComponentProps<typeof Box>;

interface MainViewProps {
  sx?: BoxProps["sx"];
  children?: ReactNode;
}

interface MainViewStyleSheet {
  mainView: BoxProps["sx"];
}

const MainView = ({ sx, children }: MainViewProps) => {
  const styles: MainViewStyleSheet = {
    mainView: {
      display: "flex",
      flexDirection: "column",
      placeItems: "center",
      ...sx,
    },
  };

  return <Box sx={styles.mainView}>{children}</Box>;
};

export default MainView;
