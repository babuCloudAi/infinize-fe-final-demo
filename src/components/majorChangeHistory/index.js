import {InfinizeTable, Widget} from '@/components/common';
import {Box, Skeleton} from '@mui/material';
import React, {useEffect, useState} from 'react';
import majorChangeHistoryData from '@/data/studentProfile//majorChangeHistory.json';
import {columns} from './columns';

export default function MajorChangeHistory() {
    const [expanded, setExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [majorChangeHistory, setMajorChangeHistory] = useState([]);

    useEffect(() => {
        setIsLoading(false); // TODO: Remove this on API integration
        setMajorChangeHistory(majorChangeHistoryData);
    }, []);

    const handleAccordionChange = () => {
        setExpanded(prev => !prev);
    };
    return (
        <Widget
            title="Major Change History"
            expanded={expanded}
            onChange={handleAccordionChange}
        >
            {isLoading && (
                <Box px={2}>
                    <Skeleton width="100%" height={120} />
                </Box>
            )}
            {!isLoading && (
                <InfinizeTable columns={columns} rows={majorChangeHistory} />
            )}
        </Widget>
    );
}
