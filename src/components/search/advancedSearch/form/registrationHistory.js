import React, {useState} from 'react';
import {Box, Typography} from '@mui/material';
import {
    formUtils,
    MultiSelectField,
    NumberRangeField
} from '@/components/common';
import predefinedOptions from '@/data/advancedSearch/registrationHistoryOptions.json';
import SectionAccordion from './accordion';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export default function RegistrationHistory({
    onFilterChange,
    registrationHistoryFilter,
    filterChips
}) {
    const REGISTRATION_HISTORY = ADVANCED_SEARCH_SECTIONS.REGISTRATION_HISTORY;
    const [expanded, setExpanded] = useState(false);
    const [registrationTerms, setRegistrationTerms] = useState(
        predefinedOptions.registrationTerms || []
    );

    const handleChange = (field, value) => {
        onFilterChange(
            REGISTRATION_HISTORY,
            formUtils.getUpdatedFormData(
                registrationHistoryFilter,
                field,
                value
            )
        );
    };
    return (
        <SectionAccordion
            title="Registration History"
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
                        Registration Terms
                    </Typography>
                    <MultiSelectField
                        name="registrationTerms"
                        label="Registration Terms"
                        value={registrationHistoryFilter?.registrationTerms}
                        options={registrationTerms}
                        onChange={val => handleChange('registrationTerms', val)}
                    />
                </Box>

                <NumberRangeField
                    name="numberofCreditsRegistered"
                    label="Number of Credits Registered"
                    value={
                        registrationHistoryFilter?.numberofCreditsRegistered ||
                        {}
                    }
                    onChange={value =>
                        handleChange('numberofCreditsRegistered', value)
                    }
                />
            </Box>
        </SectionAccordion>
    );
}
