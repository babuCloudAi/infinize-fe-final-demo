import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box
} from '@mui/material';
import {InfinizeIcon} from '@/components/common';
import classes from './common.module.css';

export function Widget({
    title,
    expanded,
    onChange,
    children,
    actions,
    unReadChip
}) {
    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            className={classes.infinize__widget}
        >
            <AccordionSummary
                component="div"
                expandIcon={
                    <InfinizeIcon
                        icon="flat-color-icons:expand"
                        width={24}
                        height={24}
                    />
                }
                sx={{
                    flexDirection: 'row-reverse'
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                >
                    <Box display="flex" alignItems="center">
                        <Typography
                            fontSize="18px"
                            fontWeight="bold"
                            color="primary.main"
                            ml={1}
                        >
                            {title}
                        </Typography>
                        {unReadChip && <Box ml={1}>{unReadChip}</Box>}
                    </Box>
                    {actions}
                </Box>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    p: 0,
                    overflow: 'hidden',
                    width: '100%'
                }}
            >
                {children}
            </AccordionDetails>
        </Accordion>
    );
}
