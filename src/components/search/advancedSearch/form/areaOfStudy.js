import React, {useState} from 'react';
import {Box, Typography} from '@mui/material';
import {
    MultiSelectField,
    SelectField,
    CustomCheckbox,
    formUtils
} from '@/components/common';
import areaOfStudyOptions from '@/data/advancedSearch/areaOfStudyOptions.json';
import SectionAccordion from './accordion';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export default function AreaOfStudy({
    areaOfStudyFilter,
    onFilterChange,
    filterChips
}) {
    const AREA_OF_STUDY = ADVANCED_SEARCH_SECTIONS.AREA_OF_STUDY;
    const [expanded, setExpanded] = useState(false);
    const [semester, setSemester] = useState(areaOfStudyOptions.semester || []);
    const [college, setCollege] = useState(areaOfStudyOptions.college || []);
    const [department, setDepartment] = useState(
        areaOfStudyOptions.department || []
    );
    const [level, setLevel] = useState(areaOfStudyOptions.level || []);
    const [degree, setDegree] = useState(areaOfStudyOptions.degree || []);
    const [major, setMajor] = useState(areaOfStudyOptions.major || []);
    const [minor, setMinor] = useState(areaOfStudyOptions.minor || []);
    const [program, setProgram] = useState(areaOfStudyOptions.program || []);
    const [concentration, setConcentration] = useState(
        areaOfStudyOptions.concentration || []
    );

    const handleChange = (field, value) => {
        onFilterChange(
            AREA_OF_STUDY,
            formUtils.getUpdatedFormData(areaOfStudyFilter, field, value)
        );
    };
    return (
        <SectionAccordion
            title="Area of Study"
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
                    <MultiSelectField
                        name="semester"
                        label="Semester"
                        value={areaOfStudyFilter?.semester}
                        options={semester}
                        onChange={value => handleChange('semester', value)}
                        helperText={
                            'You must select at least one other criterion.'
                        }
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        College
                    </Typography>
                    <MultiSelectField
                        name="college"
                        label="College"
                        value={areaOfStudyFilter?.college}
                        options={college}
                        onChange={value => handleChange('college', value)}
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        Department
                    </Typography>
                    <MultiSelectField
                        name="department"
                        label="Department"
                        value={areaOfStudyFilter?.department}
                        options={department}
                        onChange={value => handleChange('department', value)}
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        Level
                    </Typography>
                    <SelectField
                        name="level"
                        label="Level"
                        value={areaOfStudyFilter?.level}
                        options={level}
                        onChange={value => handleChange('level', value)}
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        Degree
                    </Typography>
                    <MultiSelectField
                        name="degree"
                        label="Degree"
                        value={areaOfStudyFilter?.degree}
                        options={degree}
                        onChange={value => handleChange('degree', value)}
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        Major
                    </Typography>
                    <MultiSelectField
                        name="major"
                        label="Major"
                        value={areaOfStudyFilter?.major}
                        options={major}
                        onChange={value => handleChange('major', value)}
                    />
                    <CustomCheckbox
                        label="Primary Major Only"
                        name="primaryMajorOnly"
                        value={areaOfStudyFilter?.primaryMajorOnly}
                        onChange={val => handleChange('primaryMajorOnly', val)}
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        Minor
                    </Typography>
                    <MultiSelectField
                        name="minor"
                        label="Minor"
                        value={areaOfStudyFilter?.minor || []}
                        options={minor}
                        onChange={value => handleChange('minor', value)}
                    />
                    <CustomCheckbox
                        label="Primary Minor Only"
                        name="primaryMinorOnly"
                        value={areaOfStudyFilter?.primaryMinorOnly}
                        onChange={val => handleChange('primaryMinorOnly', val)}
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        Program
                    </Typography>
                    <MultiSelectField
                        name="program"
                        label="Program"
                        value={areaOfStudyFilter?.program || []}
                        options={program}
                        onChange={value => handleChange('program', value)}
                    />
                    <CustomCheckbox
                        label="Primary Program Only"
                        name="primaryProgramOnly"
                        value={areaOfStudyFilter?.primaryProgramOnly}
                        onChange={val =>
                            handleChange('primaryProgramOnly', val)
                        }
                    />
                </Box>

                <Box>
                    <Typography className="infinize__inputLabel">
                        Concentration
                    </Typography>
                    <MultiSelectField
                        name="concentration"
                        label="Concentration"
                        value={areaOfStudyFilter?.concentration}
                        options={concentration}
                        onChange={value => handleChange('concentration', value)}
                    />
                    <CustomCheckbox
                        label="Primary Concentration Only"
                        name="primaryConcentrationOnly"
                        value={areaOfStudyFilter?.primaryConcentrationOnly}
                        onChange={val =>
                            handleChange('primaryConcentrationOnly', val)
                        }
                    />
                </Box>
            </Box>
        </SectionAccordion>
    );
}
