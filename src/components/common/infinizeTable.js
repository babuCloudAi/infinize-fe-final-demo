import React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Box} from '@mui/material';
import classes from './common.module.css';

export function InfinizeTable({rows, columns}) {
    return (
        <Box className={classes.infinize__table}>
            <DataGrid
                className={classes.infinize__dataGrid}
                rows={rows}
                columns={columns}
                disableSelectionOnClick
                disableColumnResize
                hideFooterPagination
                sx={{
                    border: 'none',
                    height: '100%',
                    overflowY: 'auto',
                    '& .MuiDataGrid-virtualScroller': {
                        overflowY: 'auto !important',
                        backgroundColor: '#fff !important'
                    },
                    '& .MuiDataGrid-container--top [role=row]': {
                        backgroundColor: '#f5f5f5 !important'
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        display: 'none !important'
                    },
                    '& .MuiDataGrid-footerContainer': {
                        display: 'none !important'
                    },
                    '& .mui-155wbr6-MuiButtonBase-root-MuiIconButton-root': {
                        color: 'white'
                    },
                    ' .mui-aymtem-MuiDataGrid-virtualScrollerContent': {
                        backgroundColor: '#fff !important'
                    },
                    '.mui-1gqmilo-MuiDataGrid-columnHeaderTitle': {
                        color: '#808A98',
                        padding: '0 10px'
                    },
                    '.MuiDataGrid-cell': {
                        padding: '0px 15px',
                        display: 'flex',
                        alignItems: 'center'
                    }
                }}
            />
        </Box>
    );
}
