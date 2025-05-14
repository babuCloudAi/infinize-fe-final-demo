'use client';
import {useState} from 'react';
import {Stack, Box, Typography, Chip} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import classes from './search.module.css';
import SavedSearchesPopup from './savedSearchesPopup';
import BasicSearch from './basicSearch';
import SearchResultsTable from './searchResultsTable';

export default function SearchResults({
    query,
    isAdvanced = false,
    onClick,
    isShowResults,
    selectedChips = {}
}) {
    const theme = useTheme();
    const [searchResult, setSearchResult] = useState(query);
    // Function to handle new search input from BasicSearch
    const handleUpdatedSearch = newQuery => {
        if (!newQuery.trim()) return;
        setSearchResult(newQuery);
    };
    console.log(selectedChips);
    return (
        <Stack spacing={4}>
            {!isAdvanced && (
                <Stack
                    spacing={3}
                    component="section"
                    className={classes.infinize__searchInput}
                    role="search"
                >
                    <Stack
                        spacing={2}
                        className={classes.infinize__searchIcon}
                        alignItems="center"
                        direction={{sm: 'column', md: 'row'}}
                    >
                        <Typography
                            className={classes.infinize__searchTitle}
                            color={theme.palette.primary.main}
                        >
                            Search for Students
                        </Typography>
                        <Box className={classes.infinize__savedSearches}>
                            <SavedSearchesPopup />
                        </Box>
                    </Stack>
                    <BasicSearch
                        direction={{sm: 'column', md: 'row'}}
                        width="100%"
                        buttonAlignment="center"
                        showSavedSearches={false}
                        inputValue={searchResult}
                        onSearch={handleUpdatedSearch}
                        isShowResults={isShowResults}
                    />
                </Stack>
            )}

            <SearchResultsTable
                query={searchResult}
                isAdvanced={isAdvanced}
                onClick={onClick}
                hasSelectedChips={selectedChips}
            />
        </Stack>
    );
}
