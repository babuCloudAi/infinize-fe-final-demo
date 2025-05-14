import React, {useEffect, useState} from 'react';
import {Box, Skeleton, Typography} from '@mui/material';
import {InfinizeDialog, InfinizeTable} from '@/components/common';
import {getColumns} from './columns';
import currentEnrollmentData from '@/data/studentProfile/currentEnrollment.json';
import StudentAnalytics from '@/components/studentAnalytics';

export default function CurrentEnrollment() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentEnrollment, setCurrentEnrollment] = useState();
    const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);

    const toggleIsStatsDialogOpen = () => {
        setIsStatsDialogOpen(prev => !prev);
    };

    useEffect(() => {
        setIsLoading(false); // TODO: Remove this on API integration
        setCurrentEnrollment(currentEnrollmentData.currentEnrollment);
    }, []);

    return (
        <Box>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 'bold',
                    my: 2,
                    ml: 2,
                    color: 'primary.main'
                }}
            >
                {isLoading && <Skeleton width="10%" />}
                {!isLoading && currentEnrollmentData.title}
            </Typography>

            {isLoading && (
                <Box px={2}>
                    <Skeleton width="100%" height={120} />
                </Box>
            )}
            {!isLoading && (
                <InfinizeTable
                    columns={getColumns(toggleIsStatsDialogOpen)}
                    rows={currentEnrollment}
                />
            )}
            <InfinizeDialog
                isOpen={isStatsDialogOpen}
                onClose={toggleIsStatsDialogOpen}
                maxWidth="lg"
                title="Student Analytics"
            >
                <StudentAnalytics />
            </InfinizeDialog>
        </Box>
    );
}
