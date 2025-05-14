import React from 'react';
import {Box} from '@mui/material';
import {CustomChip} from '@/components/common';
import classes from './filterChips.module.css';

export const StringFilterChips = ({chips, onRemoveChip}) => {
    return (
        <Box display="flex" gap={1} flexWrap="wrap">
            {chips?.map((filter, index) => (
                <CustomChip
                    key={index}
                    label={filter}
                    onDelete={() => onRemoveChip(index)}
                    color="primary"
                    variant="outlined"
                    classes={classes.infinize__chipStyle}
                />
            ))}
        </Box>
    );
};
