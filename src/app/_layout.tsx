import { CircularProgress, Typography } from "@mui/material";
import { useFFmpeg } from "../contexts/FFmpegProvider";
import MainView from "../components/MainView";
import { Outlet } from "react-router";
import { Error as ErrorIcon } from "@mui/icons-material";
import { type JSX } from "react";
import { TopBarProvider } from "../contexts/TopBarProvider";

const RootLayout = () => {
  const { loading, error } = useFFmpeg();
  const showPreload = loading || error;

  let content: JSX.Element;

  if (loading) {
    content = (
      <>
        <CircularProgress />
        <Typography variant="h2">Loading FFmpeg...</Typography>
      </>
    );
  } else if (error) {
    content = (
      <>
        <ErrorIcon sx={{ fontSize: 64 }} color="error" />
        <Typography variant="h2">
          Error loading FFmpeg. Check the console.
        </Typography>
      </>
    );
  } else {
    content = <></>;
  }

  if (showPreload) {
    return <MainView spacing={2}>{content}</MainView>;
  }

  return (
    <TopBarProvider>
      <Outlet />
    </TopBarProvider>
  );
};

export default RootLayout;
