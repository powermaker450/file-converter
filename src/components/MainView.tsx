import { Grid } from "@mui/material";
import type { ComponentProps } from "react";

type GridProps = ComponentProps<typeof Grid>;

interface MainViewStyleSheet {
  mainView: GridProps["sx"];
}

const MainView = (props: GridProps) => {
  const styles: MainViewStyleSheet = {
    mainView: {
      flex: 1,
      flexDirection: "column",
      placeItems: "center",
      ...props.sx,
    },
  };

  return (
    <Grid container {...props} sx={styles.mainView}>
      {props.children}
    </Grid>
  );
};

export default MainView;
