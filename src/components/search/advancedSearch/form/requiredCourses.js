'use client';
import React from 'react';
import {Box, Typography} from '@mui/material';
import classes from '../advancedSearch.module.css';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';
import Course from './course';

export default function RequiredCourses({
    onFilterChange,
    requiredCoursesFilter,
    courses
}) {
    const REQUIRED = ADVANCED_SEARCH_SECTIONS.REQUIRED;
    const handleFieldChange = (field, value) => {
        // Notify the parent component
        onFilterChange(field, value);
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography fontSize="16px" fontWeight="500" gutterBottom>
                Required Courses
            </Typography>
            <Box
                display="flex"
                flexDirection="column"
                gap={3}
                alignItems="unset"
                className={classes.infinize__advancedSearch__sectionsContainer}
            >
                <Course
                    fieldName={REQUIRED}
                    coursesFilter={requiredCoursesFilter}
                    courses={courses}
                    onFilterChange={handleFieldChange}
                />
            </Box>
        </Box>
    );
}
