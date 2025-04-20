import * as React from 'react';

// ** Next Imports
import { NextPage } from 'next';
import { Box, BoxProps, styled } from '@mui/material';

type TProps = {
    children: React.ReactNode;
};

const BlankLayoutWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100vh',
}));

const BlankLayout: NextPage<TProps> = ({children}) => {
  return (
    <BlankLayoutWrapper>
        <Box sx={{overflow: 'hidden', minHeight: '100vh'}}>
            {children}
        </Box>  
    </BlankLayoutWrapper>
  );
}

export default BlankLayout