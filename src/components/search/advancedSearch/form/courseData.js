import React, {useState, useEffect, useMemo} from 'react';
import {Box, Typography, Switch} from '@mui/material';
import {
    AddButton,
    DeleteButton,
    formUtils,
    SelectField,
    TextInput
} from '@/components/common';
import courseDataOptions from '@/data/advancedSearch/courseDataOptions.json';
import classes from '../advancedSearch.module.css';
import {AndOrToggle, ToggleSwitch} from './andOrToggle';
import SectionAccordion from './accordion';
import {AND, OR} from '@/config/constants';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export default function CourseData({
    courseDataFilter,
    onFilterChange,
    filterChips
}) {
    const COURSE_DATA = ADVANCED_SEARCH_SECTIONS.COURSE_DATA;
    const [expanded, setExpanded] = useState(false);
    const [courseSectionsList, setCourseSectionsList] = useState([]);
    const [courses, setCourses] = useState(courseDataOptions.Courses || []);
    const [grade, setGrade] = useState(courseDataOptions.grade || []);
    const [semester, setSemester] = useState(courseDataOptions.semester || []);

    useEffect(() => {
        // Sync the length of courseDataFilter and courseSectionsList on component mount
        // Add an object to the courseSectionsList for each item that exists in courseDataFilter
        // This will ensure that all the items in the courseDataFilter will be displayed on component mount
        // If there are no filters added (courseDataFilter is empty), then to display one section by default, initialize courseSectionsList with one object
        setCourseSectionsList(
            courseDataFilter?.courses?.map((_, index) => ({
                id: index
            })) ?? [{id: 0}]
        );
    }, [courseDataFilter]); // Runs when `courseDataFilter` changes

    const handleFieldChange = (index, field, value) => {
        const updatedData = courseDataFilter?.courses ?? [];

        let updatedCourse = formUtils.getUpdatedFormData(
            updatedData[index] ?? {},
            field,
            value
        );

        // Handle cleanup for dependent fields
        if (field === 'subject') {
            delete updatedCourse.courseNumber;
            delete updatedCourse.courseTitle;
        }

        if (field === 'courseNumber') {
            delete updatedCourse.courseTitle;
        }

        //Handle cleanup if semesterRange is false
        if (field === 'semesterRange') {
            if (!value) {
                delete updatedCourse.startSemester;
                delete updatedCourse.endSemester;
            } else {
                delete updatedCourse.semester;
            }
        }

        updatedData[index] = updatedCourse;

        const finalObject = {
            ...courseDataFilter,
            courses: updatedData
        };

        // If there are more than 1 course filters, the default condition value should be OR
        if (updatedData.length > 1) {
            if (!courseDataFilter.condition) {
                finalObject.condition = OR;
            }
        }

        // Notify the parent component
        onFilterChange(COURSE_DATA, finalObject);
    };

    const handleChange = (field, value) => {
        // Notify the parent component
        onFilterChange(
            COURSE_DATA,
            formUtils.getUpdatedFormData(
                courseDataFilter ? {...courseDataFilter} : {},
                field,
                value
            )
        );
    };

    /**
     * Adds a new empty course entry to the list.
     */
    const handleAddCourseSection = () => {
        setCourseSectionsList([
            ...courseSectionsList,
            {id: courseSectionsList?.length}
        ]);
    };

    /**
     * Removes a course entry from the list based on index.
     */
    const handleRemoveCourseSection = index => {
        // Remove the course section entry at the specified index
        const updatedList = [...courseSectionsList];
        updatedList.splice(index, 1);

        // Remove the course entry from form data at the specified index
        const updatedCoursesList = courseDataFilter?.courses
            ? [...courseDataFilter.courses]
            : [];
        updatedCoursesList.splice(index, 1);

        setCourseSectionsList(updatedList);

        if (updatedCoursesList.length <= 1) {
            delete courseDataFilter.condition;
        }

        // Update state and notify parent component
        onFilterChange(
            COURSE_DATA,
            formUtils.getUpdatedFormData(
                courseDataFilter,
                'courses',
                updatedCoursesList
            )
        );
    };

    const {subjectToCourseNumbersMap, subjectCourseNumberToTitlesMap} =
        useMemo(() => {
            // Map: subject -> Set of course numbers
            const subjectToCourseNumbersMap = new Map();
            // Map: subject+courseNumber -> Set of course titles
            const subjectCourseNumberToTitlesMap = new Map();

            // Iterate through the list of courses to build the lookup maps
            courses.forEach(course => {
                const {subject, courseNumber, courseTitle} = course;

                // Add course number to the set associated with the subject
                if (!subjectToCourseNumbersMap.has(subject)) {
                    subjectToCourseNumbersMap.set(subject, new Set());
                }
                subjectToCourseNumbersMap.get(subject).add(courseNumber);

                // Create a composite key for subject and course number
                const key = `${subject}-${courseNumber}`;

                // Add course title to the set associated with the composite key
                if (!subjectCourseNumberToTitlesMap.has(key)) {
                    subjectCourseNumberToTitlesMap.set(key, new Set());
                }
                subjectCourseNumberToTitlesMap.get(key).add(courseTitle);
            });

            // Return the maps to be memoized
            return {
                subjectToCourseNumbersMap,
                subjectCourseNumberToTitlesMap
            };
        }, [courses]); // Recalculate maps only when the `courses` array changes

    // Helper function to get a list of course numbers for a given subject
    const getCourseNumbers = subject => {
        return Array.from(subjectToCourseNumbersMap.get(subject) || []).map(
            num => ({
                label: num,
                value: num
            })
        );
    };

    // Helper function to get a list of course titles for a given subject and course number
    const getCourseTitles = (subject, courseNumber) => {
        return Array.from(
            subjectCourseNumberToTitlesMap.get(`${subject}-${courseNumber}`) ||
                []
        ).map(title => ({
            label: title,
            value: title
        }));
    };

    return (
        <SectionAccordion
            title="Course Data"
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            filterChips={filterChips}
        >
            <Box display="flex" flexDirection="column" gap={3} mt={1}>
                {courseSectionsList.length > 1 && (
                    <ToggleSwitch
                        labelLeft="At least one Course"
                        labelRight="Every Course"
                        checked={courseDataFilter?.condition === AND}
                        onChange={e =>
                            handleChange(
                                'condition',
                                e.target.checked ? AND : OR
                            )
                        }
                    />
                )}

                {courseSectionsList.map((_, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <AndOrToggle
                                isOr={courseDataFilter?.condition !== AND}
                            />
                        )}
                        <Box
                            display="grid"
                            gridTemplateColumns={{xs: '1fr', sm: '1fr 1fr'}}
                            gap={3}
                            className={
                                classes.infinize__advancedSearch__sectionsContainer
                            }
                        >
                            <Box>
                                <Typography className="infinize__inputLabel">
                                    Subject*
                                </Typography>
                                <SelectField
                                    isRequired={true}
                                    name={`subject-${index}`}
                                    label="Subject"
                                    value={
                                        courseDataFilter?.courses?.[index]
                                            ?.subject || ''
                                    }
                                    options={courses.map((option, idx) => ({
                                        label: option.subject,
                                        value: option.subject,
                                        key: `subject-${option.subject}-${idx}`
                                    }))}
                                    onChange={val =>
                                        handleFieldChange(index, 'subject', val)
                                    }
                                    helperText="Required to search on course data."
                                />
                            </Box>
                            <Box>
                                <Typography
                                    className={
                                        courseDataFilter?.courses?.[index]
                                            ?.subject
                                            ? 'infinize__inputLabel'
                                            : 'infinize__inputLabel_Disabled'
                                    }
                                >
                                    Course Number*
                                </Typography>
                                <SelectField
                                    isRequired={true}
                                    name={`courseNumber-${index}`}
                                    label="Course Number"
                                    value={
                                        courseDataFilter?.courses?.[index]
                                            ?.courseNumber || ''
                                    }
                                    options={
                                        courseDataFilter?.courses?.[index]
                                            ?.subject
                                            ? getCourseNumbers(
                                                  courseDataFilter?.courses?.[
                                                      index
                                                  ]?.subject
                                              )
                                            : [
                                                  {
                                                      label: 'Please select subject',
                                                      value: '',
                                                      disabled: true
                                                  }
                                              ]
                                    }
                                    onChange={val =>
                                        handleFieldChange(
                                            index,
                                            'courseNumber',
                                            val
                                        )
                                    }
                                    isDisabled={
                                        !courseDataFilter?.courses?.[index]
                                            ?.subject
                                    }
                                    helperText="Required to search on course data."
                                />
                            </Box>
                            <Box>
                                <Typography
                                    className={
                                        courseDataFilter?.courses?.[index]
                                            ?.courseNumber
                                            ? 'infinize__inputLabel'
                                            : 'infinize__inputLabel_Disabled'
                                    }
                                >
                                    Course Title
                                </Typography>
                                <SelectField
                                    name={`courseTitle-${index}`}
                                    label="Course Title"
                                    value={
                                        courseDataFilter?.courses?.[index]
                                            ?.courseTitle || ''
                                    }
                                    options={
                                        courseDataFilter?.courses?.[index]
                                            ?.subject &&
                                        courseDataFilter?.courses?.[index]
                                            ?.courseNumber
                                            ? getCourseTitles(
                                                  courseDataFilter?.courses?.[
                                                      index
                                                  ]?.subject,
                                                  courseDataFilter?.courses?.[
                                                      index
                                                  ]?.courseNumber
                                              )
                                            : [
                                                  {
                                                      label: 'Please select subject & course number',
                                                      value: '',
                                                      disabled: true
                                                  }
                                              ]
                                    }
                                    onChange={val =>
                                        handleFieldChange(
                                            index,
                                            'courseTitle',
                                            val
                                        )
                                    }
                                    isDisabled={
                                        !courseDataFilter?.courses?.[index]
                                            ?.courseNumber
                                    }
                                />
                            </Box>
                            <Box>
                                <Typography className="infinize__inputLabel">
                                    CRN
                                </Typography>
                                <TextInput
                                    name={`crn-${index}`}
                                    label="CRN"
                                    value={
                                        courseDataFilter?.courses?.[index]
                                            ?.crn || ''
                                    }
                                    onChange={val =>
                                        handleFieldChange(index, 'crn', val)
                                    }
                                />
                            </Box>
                            <Box>
                                <Typography className="infinize__inputLabel">
                                    Grade Filter
                                </Typography>
                                <SelectField
                                    name={`gradeFilter-${index}`}
                                    label="Grade Filter"
                                    value={
                                        courseDataFilter?.courses?.[index]
                                            ?.gradeFilter || ''
                                    }
                                    options={['=', '>', '<', '>=', '<=']}
                                    onChange={val =>
                                        handleFieldChange(
                                            index,
                                            'gradeFilter',
                                            val
                                        )
                                    }
                                />
                            </Box>
                            <Box>
                                <Typography className="infinize__inputLabel">
                                    Grade
                                </Typography>
                                <SelectField
                                    name={`grade-${index}`}
                                    label="Grade"
                                    value={
                                        courseDataFilter?.courses?.[index]
                                            ?.grade || ''
                                    }
                                    options={grade}
                                    onChange={val =>
                                        handleFieldChange(index, 'grade', val)
                                    }
                                />
                            </Box>
                            <Box>
                                <Typography className="infinize__inputLabel">
                                    Semester Range
                                </Typography>
                                <Switch
                                    checked={
                                        courseDataFilter?.courses?.[index]
                                            ?.semesterRange || false
                                    }
                                    onChange={e =>
                                        handleFieldChange(
                                            index,
                                            'semesterRange',
                                            e.target.checked
                                        )
                                    }
                                />
                            </Box>
                            {courseDataFilter?.courses?.[index]
                                ?.semesterRange && (
                                <Box display="flex" gap={2}>
                                    <Box width="100%">
                                        <Typography
                                            fontSize="16px"
                                            fontWeight="500"
                                            gutterBottom
                                            mb={1}
                                        >
                                            Start Semester
                                        </Typography>
                                        <SelectField
                                            name={`startSemester-${index}`}
                                            label="Start Semester"
                                            value={
                                                courseDataFilter?.courses?.[
                                                    index
                                                ]?.startSemester || ''
                                            }
                                            options={semester}
                                            onChange={val =>
                                                handleFieldChange(
                                                    index,
                                                    'startSemester',
                                                    val
                                                )
                                            }
                                        />
                                    </Box>
                                    <Box width="100%">
                                        <Typography
                                            fontSize="16px"
                                            fontWeight="500"
                                            gutterBottom
                                            mb={1}
                                        >
                                            End Semester
                                        </Typography>
                                        <SelectField
                                            name={`endSemester-${index}`}
                                            label="End Semester"
                                            value={
                                                courseDataFilter?.courses?.[
                                                    index
                                                ]?.endSemester || ''
                                            }
                                            options={semester}
                                            onChange={val =>
                                                handleFieldChange(
                                                    index,
                                                    'endSemester',
                                                    val
                                                )
                                            }
                                        />
                                    </Box>
                                </Box>
                            )}
                            {!courseDataFilter?.courses?.[index]
                                ?.semesterRange && (
                                <Box>
                                    <Typography className="infinize__inputLabel">
                                        Semester
                                    </Typography>
                                    <SelectField
                                        name={`semester-${index}`}
                                        label="Semester"
                                        value={
                                            courseDataFilter?.courses?.[index]
                                                ?.semester || ''
                                        }
                                        options={semester}
                                        onChange={val =>
                                            handleFieldChange(
                                                index,
                                                'semester',
                                                val
                                            )
                                        }
                                    />
                                </Box>
                            )}
                            {courseSectionsList.length > 1 && (
                                <DeleteButton
                                    onClick={() =>
                                        handleRemoveCourseSection(index)
                                    }
                                />
                            )}
                        </Box>
                    </React.Fragment>
                ))}

                <AddButton
                    onAdd={handleAddCourseSection}
                    name="Add"
                    disabled={
                        courseSectionsList.length ===
                        courseDataFilter?.courses?.length
                    }
                />
            </Box>
        </SectionAccordion>
    );
}
