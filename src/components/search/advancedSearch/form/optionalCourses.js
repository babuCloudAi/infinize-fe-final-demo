'use client';
import React from 'react';
import {Box, Typography} from '@mui/material';
import {formUtils, NumberField} from '@/components/common';
import classes from '../advancedSearch.module.css';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';
import Course from './course';

export default function OptionalCourses({
    onFilterChange,
    optionalCoursesFilter,
    courses
}) {
    const OPTIONAL = ADVANCED_SEARCH_SECTIONS.OPTIONAL;
    const handleFieldChange = (field, value) => {
        // Notify the parent component
        onFilterChange(
            OPTIONAL,
            formUtils.getUpdatedFormData(
                optionalCoursesFilter ?? {},
                field,
                value
            )
        );
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Typography fontSize="16px" fontWeight="500" gutterBottom mb={1}>
                Optional Courses
            </Typography>
            <Box
                display="flex"
                flexDirection="column"
                gap={3}
                alignItems="unset"
            >
                <Course
                    courses={courses}
                    onFilterChange={handleFieldChange}
                    fieldName={'courses'}
                    coursesFilter={optionalCoursesFilter?.courses}
                />
                <Box width="25%">
                    <Typography className={classes.infinize__inputLabel}>
                        Total Minimum Credits
                    </Typography>
                    <NumberField
                        name="minimumCredits"
                        label="Total Minimum Credits"
                        placeholder="Min"
                        value={optionalCoursesFilter?.minimumCredits}
                        onChange={val =>
                            handleFieldChange('minimumCredits', val)
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
}
