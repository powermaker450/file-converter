import { Settings } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Toolbar,
  useColorScheme,
  useTheme,
} from "@mui/material";
import {
  createContext,
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Link as RouterLink } from "react-router";
import localStorageWrapper, {
  type ThemeValue,
} from "../util/LocalStorageWrapper";

interface TopBarProviderProps {
  children?: ReactNode;
}

interface Route {
  text: string;
  to: string;
}

const TopBarContext = createContext<{} | undefined>(undefined);

export const TopBarProvider = ({ children }: TopBarProviderProps) => {
  const { mode, setMode } = useColorScheme();
  const theme = useTheme();

  const [settingsMenuShown, setSettingsMenuShown] = useState(false);
  const showSettingsMenu = () => setSettingsMenuShown(true);
  const hideSettingsMenu = () => setSettingsMenuShown(false);

  const handleThemeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMode(e.target.value as ThemeValue);
  };

  const routes: Route[] = [
    {
      text: "Audio",
      to: "/audio",
    },
    {
      text: "Video",
      to: "/video",
    },
  ];

  return (
    <TopBarContext.Provider value={{}}>
      <AppBar>
        <Toolbar>
          <Stack flex={1} direction="row" spacing={2}>
            {routes.map(route => (
              <Button
                // @ts-ignore
                color={
                  mode === "light" ? theme.palette.primary.light : undefined
                }
                key={route.text}
                component={RouterLink}
                to={route.to}
              >
                {route.text}
              </Button>
            ))}
          </Stack>

          <Stack flex={1} direction="row" justifyContent="flex-end">
            <IconButton onClick={showSettingsMenu}>
              <Settings />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Dialog onClose={hideSettingsMenu} open={settingsMenuShown}>
        <DialogTitle>Settings</DialogTitle>

        <DialogContent>
          <FormControl>
            <FormLabel>Theme</FormLabel>

            <RadioGroup
              value={mode ?? "system"}
              onChange={handleThemeChange}
              sx={{ marginRight: 20 }}
            >
              <FormControlLabel
                value="system"
                control={<Radio />}
                label="Auto"
              />
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light"
              />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" autoFocus onClick={hideSettingsMenu}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {children}
    </TopBarContext.Provider>
  );
};
