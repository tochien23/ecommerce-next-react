import * as React from 'react';

// ** Next Imports
import { NextPage } from 'next';

// ** MUI Imports
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Divider, styled } from '@mui/material';
import ListVerticalLayout from './ListVerticalLayout';

// ** Layout Import 
import IconifyIcon from 'src/components/Icon';



type TProps = {
  open: boolean,
  toggleDrawer: () => void,
};

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(12),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(12),
        },
      }),
    },
  }),
);

const VerticalLayout: NextPage<TProps> = ({ open, toggleDrawer }) => {

  return (
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <IconifyIcon icon="mingcute:left-line" fontSize={20} />
          </IconButton>
        </Toolbar>
      <Divider />
      <ListVerticalLayout open={open} />
    </Drawer>
  );
}

export default VerticalLayout;