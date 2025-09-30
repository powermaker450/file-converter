import { CircularProgress, Typography } from "@mui/material";
import { useFFmpeg } from "../contexts/FFmpegProvider";
import MainView from "../components/MainView";
import { Outlet } from "react-router";

const RootLayout = () => {
  const { loading } = useFFmpeg();

  if (loading) {
    return (
      <MainView spacing={2}>
        <CircularProgress />
        <Typography variant="h2">Loading FFmpeg...</Typography>
      </MainView>
    );
  }

  return <Outlet />;
};

export default RootLayout;
