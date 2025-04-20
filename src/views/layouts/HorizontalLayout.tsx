import * as React from 'react';

// ** Next Imports
import { NextPage } from 'next';

// ** MUI Imports
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

// ** Components Imports
import IconifyIcon from 'src/components/Icon';

import ModeToggle from './components/mode-toggle';
import UserDropdown from './components/user-dropdown';
import LanguageDropdown from './components/language-dropdown';
import { useAuth } from 'src/hooks/useAuth';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { ROUTE_CONFIG } from 'src/configs/route';
import Link from 'next/link';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

type TProps = {
  open: boolean,
  toggleDrawer: () => void,
  isHideMenu?: boolean,
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === "light" ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer, isHideMenu }) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          margin: "0 20px"
        }}
      >
        {!isHideMenu && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <IconifyIcon icon="ic:round-menu" />
          </IconButton>
        )}
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Dashboard
          </Link>
        </Typography>
        <LanguageDropdown />
        <ModeToggle />
        {user ? (
          <UserDropdown />
        ) : (
          <Button variant="contained" sx={{ ml: 2, width: "auto" }} onClick={() => router.push(ROUTE_CONFIG.LOGIN)}>
            Sign In
          </Button>
        )}
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <IconifyIcon icon="iconamoon:notification-light" />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default HorizontalLayout;