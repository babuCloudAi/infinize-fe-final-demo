import React, {useState} from 'react';
import {Box, Typography} from '@mui/material';
import {
    MultiSelectField,
    CustomDateRangePicker,
    CustomCheckbox,
    formUtils
} from '../../../common';
import systemActivityOptions from '@/data/advancedSearch/systemActivityOptions.json';
import SectionAccordion from './accordion';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export default function SystemActivity({
    onFilterChange,
    systemActivityFilter,
    filterChips
}) {
    const SYSTEM_ACTIVITY = ADVANCED_SEARCH_SECTIONS.SYSTEM_ACTIVITY;
    const [expanded, setExpanded] = useState(false);
    const [system, setSystem] = useState(systemActivityOptions.system || []);

    const handleFieldChange = (field, value) => {
        onFilterChange(
            SYSTEM_ACTIVITY,
            formUtils.getUpdatedFormData(systemActivityFilter, field, value)
        );
    };

    return (
        <SectionAccordion
            title="System Activity"
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
                        System
                    </Typography>
                    <MultiSelectField
                        name="system"
                        label="System"
                        value={systemActivityFilter?.system}
                        options={system}
                        onChange={val => handleFieldChange('system', val)}
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        Date Range
                    </Typography>

                    <CustomDateRangePicker
                        name="dateRange"
                        label="Date Range"
                        value={systemActivityFilter?.dateRange}
                        onChange={handleFieldChange}
                    />
                </Box>

                <Box>
                    <CustomCheckbox
                        name="noActivity"
                        label="No Activity"
                        value={systemActivityFilter?.noActivity}
                        onChange={val => handleFieldChange('noActivity', val)}
                    />
                </Box>
            </Box>
        </SectionAccordion>
    );
}
