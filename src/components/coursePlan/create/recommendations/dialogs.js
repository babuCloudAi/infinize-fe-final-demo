'use client';
import {useState} from 'react';
import {InfinizeDialog} from '@/components/common';
import {RadioGroupField, SelectField} from '@/components/common/form';
import {Typography, Box} from '@mui/material';

export default function CoursePlanDialogs({
    isCourseUnavailable,
    setIsCourseUnavailable,
    handleCourseUnavailable,
    selectUnavailableOption,
    setSelectUnavailableOption,
    courseUnavailableText,
    availableTermOptions,

    isCourseConflict,
    setIsCourseConflict,
    courseConflictText,
    courseConflictLabel,
    conflictCourseOptions,
    onCourseConflict,

    courseScheduleDailog,
    setCourseScheduleDailog,
    scheduleDescription,
    conflictOptions,
    onScheduleConflictDecision
}) {
    const [conflictOption, setConflictOption] = useState('');

    const [scheduleConflictOption, setScheduleConflictOption] = useState('');

    const handleUnavailableOption = () => {
        setSelectUnavailableOption('');
        handleCourseUnavailable();
    };

    const handleConflictOption = () => {
        setConflictOption('');
        onCourseConflict();
    };

    return (
        <>
            {/* Course Unavailable Dialog*/}
            {isCourseUnavailable && (
                <InfinizeDialog
                    isOpen
                    onClose={() => setIsCourseUnavailable(false)}
                    maxWidth="sm"
                    title="Course Unavailable"
                    contentText={courseUnavailableText}
                    primaryButtonLabel="Continue"
                    onPrimaryButtonClick={handleUnavailableOption}
                    isPrimaryButtonDisabled={!selectUnavailableOption}
                >
                    <Box>
                        <Typography fontSize={16} fontWeight={500} mb={1}>
                            You can move this course to any of the following
                            semesters.
                        </Typography>
                        <SelectField
                            id="selectSemisterToMove"
                            name="selectSemisterToMove"
                            label="Select a semester to move this course."
                            value={selectUnavailableOption}
                            options={availableTermOptions}
                            onChange={setSelectUnavailableOption}
                            display="block"
                        />
                    </Box>
                </InfinizeDialog>
            )}

            {/* Course Conflict Dialog*/}
            {isCourseConflict && (
                <InfinizeDialog
                    isOpen
                    onClose={() => setIsCourseConflict(false)}
                    maxWidth="sm"
                    title="Course Conflict!"
                    contentText={courseConflictText}
                    primaryButtonLabel="Continue"
                    onPrimaryButtonClick={handleConflictOption}
                    isPrimaryButtonDisabled={!conflictOption}
                >
                    <Box>
                        <Typography fontSize={16} fontWeight={500} mb={1}>
                            {courseConflictLabel}
                        </Typography>
                        <RadioGroupField
                            id="coursePlanConflict"
                            name="coursePlanConflict"
                            value={conflictOption}
                            options={conflictCourseOptions}
                            onChange={setConflictOption}
                            display="block"
                        />
                    </Box>
                </InfinizeDialog>
            )}

            {/* Course Schedule Dialog*/}
            {courseScheduleDailog && (
                <InfinizeDialog
                    isOpen
                    onClose={() => setCourseScheduleDailog(false)}
                    maxWidth="sm"
                    title="Course Schedule Conflict!"
                    contentText={scheduleDescription}
                    primaryButtonLabel="Continue"
                    onPrimaryButtonClick={onScheduleConflictDecision}
                    isPrimaryButtonDisabled={!scheduleConflictOption}
                >
                    <Box>
                        <Typography fontSize={16} fontWeight={500} mb={1}>
                            Which course would you like to keep?
                        </Typography>
                        <RadioGroupField
                            id="lowCreditAlert"
                            name="lowCreditAlert"
                            label="Which course would you like to keep?"
                            value={scheduleConflictOption}
                            options={conflictOptions}
                            onChange={setScheduleConflictOption}
                            display="block"
                        />
                    </Box>
                </InfinizeDialog>
            )}
        </>
    );
}
