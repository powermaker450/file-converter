import { Typography } from "@mui/material";
import MainView from "../components/MainView";

const App = () => {
  return (
    <MainView>
      <Typography variant="h1">Welcome.</Typography>

      <Typography variant="body1" sx={{ placeSelf: "center" }}>
        To get started, select the type of file you want to edit.
      </Typography>
    </MainView>
  );
};

export default App;
