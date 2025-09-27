import { useLocation } from "react-router";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useRef } from "react";
import MainView from "../components/MainView";

const Audio = () => {
  const location = useLocation();
  const { current: ffmpeg } = useRef(new FFmpeg());

  const convert = async () => {
    ffmpeg;
  };

  return (
    <MainView>
      <p>{location.pathname}</p>
    </MainView>
  );
};

export default Audio;
