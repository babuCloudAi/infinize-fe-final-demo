import React from 'react';
import {Box} from '@mui/material';
import {CustomChip} from '@/components/common';
import classes from './filterChips.module.css';

export const ObjectFilterChips = ({chips, onRemoveChip, section}) => {
    return (
        <Box display="flex" gap={1} flexWrap="wrap">
            {chips?.map(filter => (
                <CustomChip
                    key={`${section}-${filter.type}-${filter.index}`}
                    label={filter.label}
                    onDelete={() =>
                        onRemoveChip(section, filter.index, filter.type)
                    }
                    color="primary"
                    variant="outlined"
                    classes={classes.infinize__chipStyle}
                />
            ))}
        </Box>
    );
};
