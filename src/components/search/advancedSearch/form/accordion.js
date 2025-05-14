import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box
} from '@mui/material';
import classes from '../advancedSearch.module.css';
import {InfinizeIcon} from '@/components/common';

export default function SectionAccordion({
    title,
    expanded,
    onChange,
    children,
    filterChips
}) {
    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            className={classes.infinize__advancedSearch__accordion}
            sx={{
                borderRadius: '10px',
                ':first-of-type': {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                },
                ':last-of-type': {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10
                }
            }}
        >
            <AccordionSummary
                expandIcon={<InfinizeIcon icon={'si:expand-more-duotone'} />}
                sx={{
                    minHeight: '56px',
                    borderBottom: expanded && '2px solid #D8E6EC',
                    '& .MuiTypography-root': {
                        fontWeight: '600',
                        fontSize: '18px',
                        color: expanded && 'primary.main'
                    }
                }}
            >
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                    <Typography fontSize={'18px'} fontWeight={'600'}>
                        {title}
                    </Typography>
                    {filterChips}
                </Box>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
}
