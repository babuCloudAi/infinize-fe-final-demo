import React, {useState} from 'react';
import {Box, Typography} from '@mui/material';
import {
    SelectField,
    MultiSelectField,
    NumberRangeField,
    formUtils
} from '@/components/common';
import performanceOptions from '@/data/advancedSearch/performanceOptions.json';
import SectionAccordion from './accordion';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export default function Performance({
    performanceFilter,
    onFilterChange,
    filterChips
}) {
    const PERFORMANCE = ADVANCED_SEARCH_SECTIONS.PERFORMANCE;
    const [expanded, setExpanded] = useState(false);
    const [semester, setSemester] = useState(performanceOptions.semester || []);
    const [academicStanding, setAcademicStanding] = useState(
        performanceOptions.academicStanding || []
    );

    const handleChange = (field, value) => {
        onFilterChange(
            PERFORMANCE,
            formUtils.getUpdatedFormData(performanceFilter, field, value)
        );
    };
    return (
        <SectionAccordion
            title="Performance"
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            filterChips={filterChips}
        >
            <Box
                display="grid"
                gridTemplateColumns={{xs: '1fr', sm: '1fr 1fr'}}
                gap={3}
                mt={1}
            >
                <Box>
                    <Typography className="infinize__inputLabel">
                        Semester
                    </Typography>
                    <SelectField
                        name="semester"
                        label="Semester"
                        value={performanceFilter?.semester}
                        options={semester}
                        onChange={value => handleChange('semester', value)}
                        helperText="You must select at least one other criterion."
                    />
                </Box>
                <NumberRangeField
                    name="cumulativeGPA"
                    label="Cumulative GPA"
                    value={performanceFilter?.cumulativeGPA || {}}
                    onChange={value => handleChange('cumulativeGPA', value)}
                />
                <NumberRangeField
                    name="termGPA"
                    label="Term GPA"
                    value={performanceFilter?.termGPA || {}}
                    onChange={value => handleChange('termGPA', value)}
                />
                <NumberRangeField
                    name="totalCreditsEarned"
                    label="Total Credits Earned"
                    value={performanceFilter?.totalCreditsEarned || {}}
                    onChange={value =>
                        handleChange('totalCreditsEarned', value)
                    }
                />
                <NumberRangeField
                    name="totalCreditsAttempted"
                    label="Total Credits Attempted"
                    value={performanceFilter?.totalCreditsAttempted || {}}
                    onChange={value =>
                        handleChange('totalCreditsAttempted', value)
                    }
                />
                <NumberRangeField
                    name="highSchoolGPA"
                    label="High School GPA"
                    value={performanceFilter?.highSchoolGPA || {}}
                    onChange={value => handleChange('highSchoolGPA', value)}
                />
                <Box>
                    <Typography className="infinize__inputLabel">
                        Academic Standing
                    </Typography>
                    <MultiSelectField
                        name="academicStanding"
                        label="Academic Standing"
                        value={performanceFilter?.academicStanding}
                        options={academicStanding}
                        onChange={value =>
                            handleChange('academicStanding', value)
                        }
                    />
                </Box>
            </Box>
        </SectionAccordion>
    );
}
