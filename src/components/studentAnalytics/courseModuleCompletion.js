'use client';
import {Box} from '@mui/material';
import taskCardContent from '@/data/studentAnalytics/taskCard.json';
import {useState} from 'react';
import TaskCard from './taskCard';

export default function CourseModuleCompletion() {
    const [taskCardData, setTaskCardData] = useState(taskCardContent);

    return (
        <Box display={'flex'} flexDirection={'column'} gap={3}>
            <TaskCard
                title={taskCardData.title}
                status={taskCardData.status}
                daysLeft={taskCardData.daysLeft}
                progress={taskCardData.progress}
            />
        </Box>
    );
}
