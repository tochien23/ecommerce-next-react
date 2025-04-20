// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress';
import { Modal, ModalProps } from '@mui/material';

const CustomModel = styled(Modal)<ModalProps>(({ theme }) => ({
  "&.MuiModal-root": {
    width: '100%',
    height: '100%',
    zIndex: 2000,
    ".MuiModal-backdrop": {
      backgroundColor: `rgba(${theme.palette.customColors.main} 0.7)`,
    }
  }
}))

const Spinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme()

  return (
    <CustomModel open={true}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          ...sx
        }}
      >
        <CircularProgress disableShrink sx={{ mt: 6 }} />
      </Box>
    </CustomModel>
  )
}

export default Spinner
