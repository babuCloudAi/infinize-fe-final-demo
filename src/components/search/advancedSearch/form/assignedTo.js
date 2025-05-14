import React, {useState, useEffect} from 'react';
import {Box, Typography} from '@mui/material';
import {formUtils, SelectField} from '@/components/common';
import assignedToOptions from '@/data/advancedSearch/assignedToOptions.json';
import SectionAccordion from './accordion';
import {ADVANCED_SEARCH_SECTIONS, ASSIGN_TYPE} from '@/config/constants';

export default function AssignedTo({
    assignedToFilter,
    onFilterChange,
    filterChips
}) {
    const ASSIGNED_TO = ADVANCED_SEARCH_SECTIONS.ASSIGNED_TO;
    const [expanded, setExpanded] = useState(false);

    const [coach, setCoach] = useState(assignedToOptions.coach || []);
    const [advisor, setAdvisor] = useState(assignedToOptions.advisor || []);
    const [instructor, setInstructor] = useState(
        assignedToOptions.instructor || []
    );
    const assignType = [
        ASSIGN_TYPE.ADVISOR,
        ASSIGN_TYPE.COACH,
        ASSIGN_TYPE.INSTRUCTOR
    ];

    // Determine the options for Name field based on selected assignType
    const getNameOptions = assignType => {
        switch (assignType) {
            case ASSIGN_TYPE.INSTRUCTOR:
                return instructor;
            case ASSIGN_TYPE.ADVISOR:
                return advisor;
            case ASSIGN_TYPE.COACH:
                return coach;
            default:
                return [];
        }
    };

    const handleChange = (field, value) => {
        let updatedFilter = formUtils.getUpdatedFormData(
            assignedToFilter,
            field,
            value
        );

        if (field === 'assignType' && updatedFilter.hasOwnProperty('name')) {
            delete updatedFilter.name; // Remove 'name' key instead of resetting
        }

        onFilterChange(ASSIGNED_TO, updatedFilter);
    };

    return (
        <SectionAccordion
            title="Assigned To"
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
                        Assign Type
                    </Typography>
                    <SelectField
                        name="assignType"
                        label="Assign Type"
                        value={assignedToFilter?.assignType}
                        options={assignType}
                        onChange={value => handleChange('assignType', value)}
                    />
                </Box>

                <Box>
                    <Typography
                        className={
                            assignedToFilter?.assignType
                                ? 'infinize__inputLabel'
                                : 'infinize__inputLabel_Disabled'
                        }
                    >
                        Name
                    </Typography>
                    <SelectField
                        name="name"
                        label="Name"
                        value={assignedToFilter?.name}
                        options={getNameOptions(assignedToFilter?.assignType)}
                        onChange={value => handleChange('name', value)}
                        isDisabled={!assignedToFilter?.assignType} // Disable Name field if no assignType selected
                    />
                </Box>
            </Box>
        </SectionAccordion>
    );
}
