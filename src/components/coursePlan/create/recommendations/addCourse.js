'use client';
import {useState, useEffect, useMemo} from 'react';
import {Stack, Box, Typography, IconButton, Button} from '@mui/material';
import {InfinizeIcon} from '../../../common';
import classes from '../../coursePlan.module.css';
import {AutoCompleteSelect} from '../../../common';
import CoursePlanDialogs from './dialogs';

export default function AddCourse({
    courses,
    onCourseSelect,
    onAdd,
    onClose,
    selectedTerm,
    allTerms,
    addBannerToQueue,
    setHighlightedCourse
}) {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTermName, setSelectedTermName] = useState('');
    const [existingTermName, setExistingTermName] = useState('');
    const [conflictCourseName, setConflictCourseName] = useState('');
    const [courseConflictAlert, setCourseConflictAlert] = useState(false);
    const [courseScheduleConflictAlert, setCourseScheduleConflictAlert] =
        useState(false);
    const [conflictSchedule, setConflictSchedule] = useState('');
    const [selectedCourseLabel, setSelectedCourseLabel] = useState('');
    const [courseScheduleDailog, setCourseScheduleDailog] = useState(false);

    const handleChange = value => {
        setSelectedCourseLabel(value.label);
        setSelectedCourse(value); // Store the entire course object
        onCourseSelect(value);
        setSelectedTermName(selectedTerm.name);
        setCourseConflictAlert(false);
        setCourseScheduleConflictAlert(false);
    };

    // Function to format the option label
    const getOptionLabel = option =>
        option
            ? `${option.subject} - ${option.courseNumber} ${option.courseTitle}`
            : '';

    // Function to check equality between selected and available options
    const isOptionEqualToValue = (option, value) =>
        option.subject === value.subject &&
        option.courseNumber === value.courseNumber &&
        option.courseTitle === value.courseTitle;

    const options = useMemo(() => {
        if (!selectedTerm || courses.length === 0) return [];

        const existingCourses = selectedTerm.courses ?? [];

        return courses
            .filter(course => {
                const isAvailable = course.availableTerms.includes(
                    selectedTerm.code
                );
                const isAlreadyAdded = existingCourses.some(
                    existing =>
                        existing.subject === course.subject &&
                        existing.courseNumber === course.courseNumber
                );

                return isAvailable && !isAlreadyAdded;
            })
            .map(course => ({
                ...course,
                label: `${course.subject} - ${course.courseNumber} ${course.courseTitle}`
            }));
    }, [courses, selectedTerm]);

    const handleDoneButton = () => {
        if (!selectedCourse) {
            console.warn('No course selected');
            return;
        }

        // Check duplicate across terms
        const duplicateResult = isCourseDuplicate(selectedCourse, allTerms);
        if (duplicateResult.duplicate) {
            setExistingTermName(duplicateResult.existingTermName);
            setCourseConflictAlert(true);
            setSelectedCourse('');

            setTimeout(() => {
                setCourseConflictAlert(false);
            }, 6000);

            return;
        }

        // Check schedule conflict in this term
        const scheduleConflictResult = checkScheduleConflict(
            selectedCourse,
            selectedTerm.courses
        );
        if (scheduleConflictResult.conflict) {
            setConflictCourseName(scheduleConflictResult.conflictCourseName);
            setConflictSchedule(scheduleConflictResult.conflictSchedule);
            setCourseScheduleConflictAlert(true);
            return;
        }

        // Ensure the selected term is valid
        if (!selectedTerm) {
            console.warn('No term selected');
            return;
        }

        // All good – add course to the selected term only
        setCourseConflictAlert(false);
        setCourseScheduleConflictAlert(false);

        onAdd(selectedCourse, selectedTerm.code);
    };

    function isCourseDuplicate(selectedCourse, allTerms) {
        const subject = selectedCourse?.subject ?? '';
        const courseNumber = selectedCourse?.courseNumber ?? '';

        if (!subject || !courseNumber) {
            console.warn(
                'Selected course is missing subject or courseNumber:',
                selectedCourse
            );
            return {duplicate: false};
        }

        const selectedKey = `${subject}-${courseNumber}`;

        for (const term of allTerms) {
            const termCourses = term.courses ?? [];
            const match = termCourses.some(
                course =>
                    `${course.subject}-${course.courseNumber}` === selectedKey
            );

            if (match) {
                return {duplicate: true, existingTermName: term.name};
            }
        }

        return {duplicate: false};
    }

    function convertToMinutesRange(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return {start: 0, end: 0};
        const normalizedTimeStr = timeStr.replace('–', '-').trim();
        const [start, end] = normalizedTimeStr.split('-').map(t => t.trim());

        if (!start || !end) return {start: 0, end: 0};

        function toMinutes(t) {
            const [timePart, modifier] = t.split(' ');
            if (!timePart || !modifier) return 0;
            let [hours, minutes] = timePart.split(':').map(Number);

            if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
            if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

            return hours * 60 + minutes;
        }

        return {
            start: toMinutes(start),
            end: toMinutes(end)
        };
    }

    // function checkScheduleConflict(newCourse, existingCourses) {
    //     const courses = existingCourses ?? [];
    //     for (const existingCourse of courses) {
    //         for (const existingSchedule of existingCourse.schedule) {
    //             for (const newSchedule of newCourse.schedule) {
    //                 const daysOverlap = [...newSchedule.days].some(day =>
    //                     existingSchedule.days.includes(day)
    //                 );

    //                 if (daysOverlap) {
    //                     const {start: newStart, end: newEnd} =
    //                         convertToMinutesRange(newSchedule.time);
    //                     const {start: existingStart, end: existingEnd} =
    //                         convertToMinutesRange(existingSchedule.time);

    //                     const timeOverlap =
    //                         newStart < existingEnd && newEnd > existingStart;

    //                     if (timeOverlap) {
    //                         return {
    //                             conflict: true,
    //                             conflictCourseName: `${existingCourse.subject} - ${existingCourse.courseNumber}  ${existingCourse.courseTitle}`,
    //                             conflictSchedule: `${existingSchedule.days} ${existingSchedule.time}`
    //                         };
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return {conflict: false};
    // }

    function checkScheduleConflict(newCourse, existingCourses) {
        const courses = existingCourses ?? [];
        for (const existingCourse of courses) {
            const schedules = Array.isArray(existingCourse.schedule)
                ? existingCourse.schedule
                : [];

            for (const existingSchedule of schedules) {
                for (const newSchedule of newCourse.schedule) {
                    const daysOverlap = [...newSchedule.days].some(day =>
                        existingSchedule.days.includes(day)
                    );

                    if (daysOverlap) {
                        const {start: newStart, end: newEnd} =
                            convertToMinutesRange(newSchedule.time);
                        const {start: existingStart, end: existingEnd} =
                            convertToMinutesRange(existingSchedule.time);

                        const timeOverlap =
                            newStart < existingEnd && newEnd > existingStart;

                        if (timeOverlap) {
                            return {
                                conflict: true,
                                conflictCourseName: `${existingCourse.subject} - ${existingCourse.courseNumber}  ${existingCourse.courseTitle}`,
                                conflictSchedule: `${existingSchedule.days} ${existingSchedule.time}`
                            };
                        }
                    }
                }
            }
        }
        return {conflict: false};
    }

    const handleScheduleConflictAction = () => {
        setCourseScheduleDailog(true);
    };

    const handleHightlightCourse = courseName => {
        const conflictId = `course-${courseName.split(' ')[0]}-${
            courseName.split(' ')[2]
        }`;
        const element = document.getElementById(conflictId);

        if (element) {
            element.scrollIntoView({behavior: 'smooth', block: 'center'});
            setHighlightedCourse(
                `${courseName.split(' ')[0]}-${courseName.split(' ')[2]}`
            );
        }
    };

    const onScheduleConflictDecision = shouldReplace => {
        setCourseScheduleDailog(false);

        if (shouldReplace) {
            // Remove the conflicting course
            selectedTerm.courses = selectedTerm.courses.filter(
                course =>
                    `${course.subject} - ${course.courseNumber}` !==
                    `${conflictCourseName.split('  ')[0].trim()}`
            );
        } else {
            // Remove the newly added conflicting course
            selectedTerm.courses = selectedTerm.courses.filter(
                course =>
                    `${course.subject} - ${course.courseNumber}` !==
                    `${selectedCourseLabel.split(' ')[0]}-${
                        selectedCourseLabel.split(' ')[2]
                    }`
            );
        }

        setCourseScheduleConflictAlert(false);

        // Reset state
        setScheduleConflictOption('');
    };

    useEffect(() => {
        if (
            courseConflictAlert &&
            selectedCourseLabel &&
            selectedTermName &&
            existingTermName
        ) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            addBannerToQueue({
                type: 'warning',
                title: 'Course Conflict!',
                description: `Unable to add the course ${selectedCourseLabel} to ${selectedTermName} since it is already scheduled for ${existingTermName}`,
                onCourseClick: () => handleHightlightCourse(selectedCourseLabel)
            });
        }
    }, [
        courseConflictAlert,
        selectedCourseLabel,
        selectedTermName,
        existingTermName
    ]);

    useEffect(() => {
        if (courseScheduleConflictAlert) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            addBannerToQueue({
                type: 'warning',
                title: 'Course schedule conflict!',
                description: `The courses ${selectedCourseLabel} and ${conflictCourseName} are scheduled at the same time: ${conflictSchedule} in ${selectedTermName}`,
                isCloseIcon: false,
                isActionButton: true,
                onActionResolve: handleScheduleConflictAction,
                onCourseClick: () => handleHightlightCourse(conflictCourseName)
            });
        }
    }, [
        courseScheduleConflictAlert,
        selectedCourseLabel,
        conflictCourseName,
        conflictSchedule,
        selectedTermName
    ]);

    return (
        <>
            <Box sx={{position: 'relative', width: '100%'}}>
                <Stack direction="row" alignItems="start" spacing={1}>
                    <AutoCompleteSelect
                        name="course"
                        label="Select Course"
                        options={options}
                        value={selectedCourse}
                        onChange={handleChange}
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
                        minFilterLength={1}
                        cunstomRenderOption={(props, option) => (
                            <Stack
                                {...props}
                                key={`${option.subject}-${option.courseNumber}`}
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{
                                    backgroundColor: '#ffffff',
                                    '&:hover': {backgroundColor: '#f0f0f0'},
                                    padding: '8px',
                                    mb: 1
                                }}
                            >
                                <Stack width="100%" spacing={0.5}>
                                    <Typography>{`${option.subject} - ${option.courseNumber} ${option.courseTitle}`}</Typography>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        className={
                                            classes.infinize__coursePlanSchedule
                                        }
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={1.5}
                                            alignItems="center"
                                        >
                                            {option.schedule && (
                                                <Stack
                                                    direction="row"
                                                    spacing={0.5}
                                                    alignItems="center"
                                                    pt={0.5}
                                                    className={
                                                        classes.infinize__coursePlanSchedule
                                                    }
                                                >
                                                    <InfinizeIcon
                                                        icon="mingcute:time-line"
                                                        width="16px"
                                                        height="16px"
                                                        className="menuItemIcon"
                                                    />
                                                    <Typography variant="body2">
                                                        {option.schedule.days}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {option.schedule.time}
                                                    </Typography>
                                                </Stack>
                                            )}
                                        </Stack>
                                        <Typography fontSize={12}>
                                            Credits: {option.credits}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        )}
                    />

                    <IconButton
                        onClick={onClose}
                        aria-label="remove-course"
                        className={classes.infinize__coursePlanCircleDelete}
                    >
                        <InfinizeIcon
                            icon="mdi:minus-circle-outline"
                            className="menuItemIcon"
                        />
                    </IconButton>
                </Stack>
                <Button
                    variant="text"
                    fullWidth
                    onClick={handleDoneButton}
                    className={classes.infinize__coursePlanAddButton}
                    disabled={!selectedCourse}
                    sx={{
                        '&.Mui-disabled': {
                            color: '#aaa !important',
                            cursor: 'not-allowed !important'
                        },
                        marginTop: '15px'
                    }}
                >
                    Done
                </Button>
            </Box>

            <CoursePlanDialogs
                courseScheduleDailog={courseScheduleDailog}
                setCourseScheduleDailog={setCourseScheduleDailog}
                scheduleDescription={`The courses ${selectedCourseLabel} and ${conflictCourseName} are scheduled at the same time: ${conflictSchedule} in ${selectedTermName}`}
                conflictOptions={[
                    `Keep ${selectedCourseLabel}`,
                    `Keep ${conflictCourseName}`
                ]}
                onScheduleConflictDecision={onScheduleConflictDecision}
            />
        </>
    );
}
