'use client';
import {Box, Typography} from '@mui/material';
import taskCardContent from '@/data/studentAnalytics/taskCard.json';
import {useState} from 'react';
import TaskCard from './taskCard';

export default function CourseModuleCompletion({data}) {
    const [taskCardData, setTaskCardData] = useState(taskCardContent);

    return (
        <Box display={'flex'} flexDirection={'column'} gap={3}>
            <TaskCard
                title={
                    <Typography variant="body1" fontWeight={500}>
                        {`${data.subject} ${data.courseNumber} ${data.title}`}
                    </Typography>
                }
                status={taskCardData.status}
                daysLeft={taskCardData.daysLeft}
                progress={taskCardData.progress}
            />
        </Box>
    );
}
