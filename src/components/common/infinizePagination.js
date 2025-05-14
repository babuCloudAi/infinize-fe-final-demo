import React from 'react';
import {Pagination, PaginationItem} from '@mui/material';
import {styled} from '@mui/material/styles';

const CustomPagination = styled(Pagination)(({theme}) => ({
    '& .MuiPaginationItem-root': {
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        minWidth: '36px',
        height: '36px',
        color: '#000'
    },
    '& .MuiPaginationItem-page.Mui-selected': {
        color: '#1C71B5',
        border: '1px solid #1C71B5',
        fontWeight: 500
    },
    '& .MuiPaginationItem-ellipsis': {
        border: 'none'
    },
    '& .MuiPaginationItem-previousNext': {
        backgroundColor: '#1C71B5',
        color: '#ffff',
        '&:hover': {
            backgroundColor: '#1C71B5'
        }
    }
}));

export function InfinizePagination({onPageChange, page, count}) {
    return (
        <CustomPagination
            count={count}
            page={page}
            onChange={onPageChange} // Page change handler
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
            showFirstButton={false}
            showLastButton={false}
        />
    );
}
