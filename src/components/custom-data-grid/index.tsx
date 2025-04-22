import { Box, styled} from '@mui/material'
import { DataGridProps, DataGrid } from '@mui/x-data-grid';

import React, { forwardRef, Ref } from 'react';

const StyledCustomGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    '& .MuiDataGrid-cell': {
        color: theme.palette.text.primary,
    },
    '& .MuiDataGrid-footerContainer': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
}))

const CustomDataGrid = forwardRef((props: DataGridProps, ref: Ref<any>) => {

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <StyledCustomGrid
                {...props}
            />
        </Box>
    )
})

export default CustomDataGrid