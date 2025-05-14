import React, {useEffect, useState} from 'react';
import creditsCompletedData from '@/data/studentProfile/creditsCompleted.json';
import {columns} from './columns';
import {InfinizeTable, Widget} from '@/components/common';
import {Box, Skeleton} from '@mui/material';

export default function CreditsCompleted() {
    const [expanded, setExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [creditsCompleted, setCreditsCompleted] = useState([]);

    useEffect(() => {
        setIsLoading(false); // TODO: Remove this on API integration
        setCreditsCompleted(creditsCompletedData);
    }, []);

    const handleAccordionChange = () => {
        setExpanded(prev => !prev);
    };

    return (
        <Widget
            title="Credits Completed"
            expanded={expanded}
            onChange={handleAccordionChange}
        >
            {isLoading && (
                <Box px={2}>
                    <Skeleton width="100%" height={120} />
                </Box>
            )}
            {!isLoading && (
                <InfinizeTable columns={columns} rows={creditsCompleted} />
            )}
        </Widget>
    );
}
