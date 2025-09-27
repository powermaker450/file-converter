import { Alert, Box, Portal } from "@mui/material";
import {
  type ComponentProps,
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AlertProviderProps {
  children: ReactNode;
}

type AlertProviderFn = (text: string) => void;

interface AlertProviderStyleSheet {
  alertBox: ComponentProps<typeof Box>["sx"];
}

interface AlertProviderData {
  success: AlertProviderFn;
  show: AlertProviderFn;
  warn: AlertProviderFn;
  error: AlertProviderFn;
}

const AlertContext = createContext<AlertProviderData | undefined>(undefined);

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [shown, setShown] = useState(false);
  const showAlert = () => setShown(true);
  const hideAlert = () => setShown(false);

  const [text, setText] = useState("");
  const clearText = () => setText("");

  const [severity, setSeverity] =
    useState<ComponentProps<typeof Alert>["severity"]>();
  const clearSeverity = () => setSeverity(undefined);

  const hideAfterDelay = () =>
    void setTimeout(() => {
      hideAlert();
      clearText();
      clearSeverity();
    }, 5000);

  const success: AlertProviderFn = text => {
    setText(text);
    setSeverity("success");
    showAlert();
    hideAfterDelay();
  };

  const show: AlertProviderFn = text => {
    setText(text);
    setSeverity("info");
    showAlert();
    hideAfterDelay();
  };

  const warn: AlertProviderFn = text => {
    setText(text);
    setSeverity("warning");
    showAlert();
    hideAfterDelay();
  };

  const error: AlertProviderFn = text => {
    setText(text);
    setSeverity("error");
    showAlert();
    hideAfterDelay();
  };

  const styles: AlertProviderStyleSheet = {
    alertBox: {
      position: "absolute",
      bottom: 10,
      left: "10%",
      right: "10%",
    },
  };

  return (
    <AlertContext.Provider
      value={{
        success,
        show,
        warn,
        error,
      }}
    >
      {children}

      <Portal>
        {shown ? (
          <Box sx={styles.alertBox}>
            <Alert severity={severity}>{text}</Alert>
          </Box>
        ) : undefined}
      </Portal>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (context === undefined) {
    throw new Error("useAlert must be called within an AlertProvider");
  }

  return context;
};
