import {InfinizeTable, Widget} from '@/components/common';
import React, {useEffect, useState} from 'react';
import holdsData from '@/data/studentProfile/holds.json';
import {columns} from './columns';
import {Box, Skeleton} from '@mui/material';

export default function Holds() {
    const [expanded, setExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [holds, setHolds] = useState([]);

    useEffect(() => {
        setIsLoading(false); // TODO: Remove this on API integration
        setHolds(holdsData);
    }, []);

    const handleAccordionChange = () => {
        setExpanded(prev => !prev);
    };

    return (
        <Widget
            title="Holds"
            expanded={expanded}
            onChange={handleAccordionChange}
        >
            {isLoading && (
                <Box px={2}>
                    <Skeleton width="100%" height={120} />
                </Box>
            )}
            {!isLoading && <InfinizeTable columns={columns} rows={holds} />}
        </Widget>
    );
}
