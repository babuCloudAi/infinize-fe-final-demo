import React, {useState} from 'react';
import {Box, Typography} from '@mui/material';
import {
    SelectField,
    TextInput,
    MultiSelectField,
    CustomDatePicker,
    formUtils
} from '../../../common';
import studentInfoOptions from '@/data/advancedSearch/studentInfoOptions.json';
import SectionAccordion from './accordion';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export default function StudentInfo({
    onFilterChange,
    studentInfoFilter,
    filterChips
}) {
    const STUDENT_INFO = ADVANCED_SEARCH_SECTIONS.STUDENT_INFO;

    const [expanded, setExpanded] = useState(false);
    const [raceEthnicity, setRaceEthnicity] = useState(
        studentInfoOptions.raceEthnicity || []
    );
    const [cohort, setCohort] = useState(studentInfoOptions.cohort || []);
    const [studentType, setStudentType] = useState(
        studentInfoOptions.studentType || []
    );
    const [gender, setGender] = useState(studentInfoOptions.gender || []);

    const handleFieldChange = (field, value) => {
        onFilterChange(
            STUDENT_INFO,
            formUtils.getUpdatedFormData(studentInfoFilter, field, value)
        );
    };

    return (
        <SectionAccordion
            title="Student Info"
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
                        Student Identifier
                    </Typography>
                    <TextInput
                        name="studentIdentifier"
                        label="Student Identifier"
                        value={studentInfoFilter?.studentIdentifier}
                        onChange={val =>
                            handleFieldChange('studentIdentifier', val)
                        }
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Email
                    </Typography>
                    <TextInput
                        name="email"
                        label="Email"
                        value={studentInfoFilter?.email}
                        onChange={val => handleFieldChange('email', val)}
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        First Name
                    </Typography>
                    <TextInput
                        name="firstName"
                        label="First Name"
                        value={studentInfoFilter?.firstName}
                        onChange={val => handleFieldChange('firstName', val)}
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Last Name
                    </Typography>
                    <TextInput
                        name="lastName"
                        label="Last Name"
                        value={studentInfoFilter?.lastName}
                        onChange={val => handleFieldChange('lastName', val)}
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Gender
                    </Typography>
                    <SelectField
                        name="gender"
                        label="Gender"
                        value={studentInfoFilter?.gender}
                        options={gender}
                        onChange={val => handleFieldChange('gender', val)}
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Race/Ethnicity
                    </Typography>
                    <MultiSelectField
                        name="raceEthnicity"
                        label="Race/Ethnicity"
                        value={studentInfoFilter?.raceEthnicity}
                        options={raceEthnicity}
                        onChange={val =>
                            handleFieldChange('raceEthnicity', val)
                        }
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Cohort
                    </Typography>
                    <MultiSelectField
                        name="cohort"
                        label="Cohort"
                        value={studentInfoFilter?.cohort}
                        options={cohort}
                        onChange={val => handleFieldChange('cohort', val)}
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Student Type
                    </Typography>
                    <MultiSelectField
                        name="studentType"
                        label="Student Type"
                        value={studentInfoFilter?.studentType}
                        options={studentType}
                        onChange={val => handleFieldChange('studentType', val)}
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        First Generation
                    </Typography>
                    <SelectField
                        name="firstGeneration"
                        label="First Generation"
                        value={studentInfoFilter?.firstGeneration}
                        options={['Yes', 'No']}
                        onChange={val =>
                            handleFieldChange('firstGeneration', val)
                        }
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Military
                    </Typography>
                    <SelectField
                        name="military"
                        label="Military"
                        value={studentInfoFilter?.military}
                        options={['Yes', 'No']}
                        onChange={val => handleFieldChange('military', val)}
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Athlete
                    </Typography>
                    <SelectField
                        name="athlete"
                        label="Athlete"
                        value={studentInfoFilter?.athlete}
                        options={['Yes', 'No']}
                        onChange={val => handleFieldChange('athlete', val)}
                    />
                </Box>
                <Box>
                    <Typography className="infinize__inputLabel">
                        Active Holds As Of
                    </Typography>
                    <CustomDatePicker
                        name="activeHoldsAsOf"
                        label="Active Holds As Of"
                        value={studentInfoFilter?.activeHoldsAsOf}
                        onChange={val =>
                            handleFieldChange('activeHoldsAsOf', val)
                        }
                    />
                </Box>
            </Box>
        </SectionAccordion>
    );
}
