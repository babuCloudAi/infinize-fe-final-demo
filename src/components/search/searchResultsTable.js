'use client';
import {Box, Stack, Typography} from '@mui/material';
import {useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import columns from './columns';
import students from '@/data/search/searchResults.json';
import classes from './search.module.css';
import {useTheme} from '@mui/material/styles';
import {CustomChip, InfinizeIcon} from '../common';
import AdvancedSearchButton from './advancedSearchButton';
import NoResultsPlaceholder from './noResultsPlaceholder ';

export default function SearchResultsTable({
    query,
    isAdvanced = false,
    buttonAlignment = 'end',
    onClick,
    hasSelectedChips
}) {
    const [isLoading, setIsLoading] = useState(true);

    setTimeout(() => {
        setIsLoading(false); // TODO: remove this on API integration
    }, 2000);

    const theme = useTheme();

    return (
        <Stack spacing={2}>
            <Box display={'flex'} justifyContent={'space-between'}>
                <Box>
                    <Typography
                        className={classes.infinize__searchTitle}
                        color="primary.main"
                        display="flex"
                        alignItems="center"
                        gap="15px"
                    >
                        <InfinizeIcon
                            icon="fluent:people-search-24-regular"
                            className={classes.infinize__searchResultsIcon}
                            style={{
                                color: 'white'
                            }}
                        />
                        {isAdvanced
                            ? 'Search Results'
                            : `Search Results for "${query}"`}
                    </Typography>
                    {hasSelectedChips &&
                        Object.entries(hasSelectedChips).map(
                            ([section, chips]) => (
                                <Box key={section} display={'flex'} mt={0.5}>
                                    <Box display="flex" gap={1}>
                                        {Array.isArray(chips) &&
                                            chips.map((chip, index) => (
                                                <CustomChip
                                                    key={index}
                                                    label={chip.label || chip}
                                                    variant="outlined"
                                                />
                                            ))}
                                    </Box>
                                </Box>
                            )
                        )}
                </Box>

                {isAdvanced && (
                    <AdvancedSearchButton
                        buttonAlignment={buttonAlignment}
                        isAdvanced={true}
                        onClick={onClick}
                    />
                )}
            </Box>

            <Box sx={{height: 600, width: '100%'}}>
                <DataGrid
                    rows={isLoading ? [] : students}
                    columns={columns}
                    slots={{noRowsOverlay: () => <NoResultsPlaceholder />}}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10, page: 0}
                        }
                    }}
                    loading={isLoading}
                    pageSizeOptions={[10, 25, 50, 75, 100]}
                    disableRowSelectionOnClick
                    isRowSelectable={() => false}
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-columnHeader': {
                            color: '#fff',
                            backgroundColor: theme.palette.primary.main
                        },
                        '& .MuiDataGrid-iconSeparator': {
                            display: 'none'
                        }
                    }} // TODO: remove inline styling
                    className={classes.infinize__dataGrid}
                />
            </Box>
        </Stack>
    );
}
