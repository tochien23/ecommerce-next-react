import * as React from 'react';

// ** Next Imports
import { NextPage } from 'next';

// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

// ** Layout Import
import HorizontalLayout from './HorizontalLayout';
import VerticalLayout from './VerticalLayout'; 

type TProps = {
  children: React.ReactNode;
};

const UserLayout: NextPage<TProps> = ({children}) => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    // <Box sx={{ display: 'flex' }}>
    //   <CssBaseline />
    //   <HorizontalLayout toggleDrawer={toggleDrawer} open={open} />
    //   <VerticalLayout toggleDrawer={toggleDrawer} open={open} />
    //   <Box
    //     component="main"
    //     sx={{
    //       backgroundColor: (theme) =>
    //         theme.palette.mode === 'light'
    //           ? theme.palette.grey[100]
    //           : theme.palette.grey[900],
    //       flexGrow: 1,
    //       height: '100vh',
    //       overflow: 'auto',
    //     }}
    //   >
    //     <Toolbar />
    //     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    //       {children}
    //     </Container>
    //   </Box>
    // </Box>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HorizontalLayout toggleDrawer={toggleDrawer} open={open} />
      <VerticalLayout toggleDrawer={toggleDrawer} open={open} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default UserLayout;