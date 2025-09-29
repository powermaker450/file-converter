import { AppBar, Button, Toolbar } from "@mui/material";
import { createContext, type ComponentProps, type ReactNode } from "react";
import { Link as RouterLink } from "react-router";

interface TopBarProviderProps {
  children?: ReactNode;
}

interface TopBarStyleSheet {
  toolbar: ComponentProps<typeof Toolbar>["sx"];
}

interface Route {
  text: string;
  to: string;
}

const TopBarContext = createContext<{} | undefined>(undefined);

export const TopBarProvider = ({ children }: TopBarProviderProps) => {
  const styles: TopBarStyleSheet = {
    toolbar: {
      gap: 5,
    },
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
        <Toolbar sx={styles.toolbar}>
          {routes.map(route => (
            <Button key={route.text} component={RouterLink} to={route.to}>
              {route.text}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {children}
    </TopBarContext.Provider>
  );
};
