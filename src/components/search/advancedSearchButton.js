import React from 'react';
import {Button, colors, Stack} from '@mui/material';
import Link from 'next/link';
import {useTheme} from '@mui/material/styles';
import classes from './search.module.css';
import {InfinizeIcon} from '../common';

const AdvancedSearchButton = ({
    isAdvanced,
    buttonAlignment = 'end',
    onClick,
    isShowResults
}) => {
    const theme = useTheme();

    return (
        <Stack>
            {isAdvanced && (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        alignItems: 'end'
                    }}
                    className={classes.infinize__advanceSearch}
                    aria-label="Advanced search"
                    onClick={onClick}
                    startIcon={
                        <InfinizeIcon
                            icon="iconamoon:search"
                            width={20}
                            height={20}
                            style={{color: 'white'}}
                        />
                    }
                >
                    Advanced Search
                </Button>
            )}
            {!isAdvanced && !isShowResults && (
                <Link
                    sx={{alignSelf: buttonAlignment}}
                    className={classes.infinize__advanceSearchLink}
                    aria-label="Advanced search"
                    href="/search/advanced"
                >
                    Advanced Search
                </Link>
            )}
            {!isAdvanced && isShowResults && (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        alignSelf: buttonAlignment
                    }}
                    className={classes.infinize__advanceSearch}
                    aria-label="Advanced search"
                    component={Link}
                    href="/search/advanced"
                >
                    Advanced Search
                </Button>
            )}
        </Stack>
    );
};

export default AdvancedSearchButton;
