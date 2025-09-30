import { useLocation } from "react-router";
import MainView from "../components/MainView";

const Audio = () => {
  const location = useLocation();

  return (
    <MainView>
      <p>{location.pathname}</p>
    </MainView>
  );
};

export default Audio;
