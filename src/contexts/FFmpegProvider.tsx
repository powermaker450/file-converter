import { FFmpeg, type LogEventCallback } from "@ffmpeg/ffmpeg";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
// import core from "@ffmpeg/core-mt?url";
// import wasm from "@ffmpeg/core-mt/wasm?url";
// import worker from "@ffmpeg/core-mt/worker?url"
import { useAlert } from "../contexts/AlertProvider";
import { toBlobURL } from "@ffmpeg/util";

interface FFmpegProviderProps {
  children?: ReactNode;
}

interface FFmpegProviderData {
  ffmpeg: FFmpeg;
  loading: boolean;
  error: boolean;
  errorData: Error | undefined;
}

const FFmpegContext = createContext<FFmpegProviderData | undefined>(undefined);

export const FFmpegProvider = ({ children }: FFmpegProviderProps) => {
  const notice = useAlert();
  const { current: ffmpeg } = useRef(new FFmpeg());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorData, setErrorData] = useState<Error>();

  useEffect(() => {
    const logListener: LogEventCallback = e => {
      console.log("[FFMPEG]", e.message);
    };

    ffmpeg.on("log", logListener);

    (async () => {
      try {
        const baseURL =
          "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm";
        const javascript = "text/javascript";
        const wasm = "application/wasm";

        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, javascript),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, wasm),
          workerURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.worker.js`,
            javascript,
          ),
        });
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          notice.error(err.message);
          setErrorData(err);
        }

        setError(true);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      ffmpeg.off("log", logListener);
      setLoading(true);
      setError(false);
      setErrorData(undefined);
    };
  }, []);

  return (
    <FFmpegContext.Provider
      value={{
        ffmpeg,
        loading,
        error,
        errorData,
      }}
    >
      {children}
    </FFmpegContext.Provider>
  );
};

export const useFFmpeg = () => {
  const context = useContext(FFmpegContext);

  if (context === undefined) {
    throw new Error("useFFmeg must be called within an FFmpegProvider");
  }

  return context;
};
