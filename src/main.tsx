import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App";
import Audio from "./app/Audio";
import Video from "./app/Video";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AlertProvider } from "./contexts/AlertProvider";
import { FFmpegProvider } from "./contexts/FFmpegProvider";
import RootLayout from "./app/_layout";

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
          <AlertProvider>
            <FFmpegProvider>
              <Routes>
                <Route element={<RootLayout />}>
                  <Route path="/" element={<App />} />
                  <Route path="/video" element={<Video />} />
                  <Route path="/audio" element={<Audio />} />
                </Route>
              </Routes>
            </FFmpegProvider>
          </AlertProvider>
        </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
