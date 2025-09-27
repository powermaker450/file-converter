import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router";
import Audio from "./pages/Audio";
import Video from "./pages/Video";
import { TopBarProvider } from "./contexts/TopBarProvider";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AlertProvider } from "./contexts/AlertProvider";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <TopBarProvider>
            <AlertProvider>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/audio" element={<Audio />} />
                <Route path="/video" element={<Video />} />
              </Routes>
            </AlertProvider>
          </TopBarProvider>
        </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
