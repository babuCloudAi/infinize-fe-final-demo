'use client';
import {useState, useEffect, useMemo} from 'react';
import {useRouter, useParams} from 'next/navigation';
import {Box, Stack, Typography} from '@mui/material';
import CoursePlanCard from './coursePlanCard';
import AdditionalRecommendations from './additionalRecommendations';
import classes from '../../coursePlan.module.css';
import CoursePlanData from '@/data/coursePlan/coursePlan.json';
import Recommendationsdata from '@/data/coursePlan/recommendations.json';
import CourseData from '@/data/coursePlan/courses.json';
import ActionButtons from './actionButtons';
import {
    Loader,
    InfinizeDialog,
    RadioGroupField,
    TextInput
} from '@/components/common';
import CoursePlanDialogs from './dialogs';
import CoursePlanBanners from '../../../common/banners';

export default function CoursePlanRecommendations({onRestart}) {
    const {studentId} = useParams();
    const router = useRouter();
    const studentProfilePath = `/student/${studentId}`;

    const [selectReplaceOption, setSelectReplaceOption] = useState('');
    const [coursePlan, setCoursePlan] = useState();
    const [recommendations, setRecommendations] = useState({});
    const [courseList, setCourseList] = useState([]);
    const [isSaveInProgress, setIsSaveInProgress] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isReplaceDialogOpen, setIsReplaceDialogOpen] = useState(false);
    const [bannerQueue, setBannerQueue] = useState([]);
    const [isCourseUnavailable, setIsCourseUnavailable] = useState(false);
    const [unavailableCourseInfo, setUnavailableCourseInfo] = useState(null);
    const [allTerms, setAllTerms] = useState(null);
    const [totalCredits, setTotalCredits] = useState('');
    const [selectUnavailableOption, setSelectUnavailableOption] = useState('');
    const [courseScheduleDailog, setCourseScheduleDailog] = useState(false);
    const [scheduleCourseInfo, setScheduleConflictOption] = useState(null);
    const [highlightedCourse, setHighlightedCourse] = useState('');
    const [isCourseConflict, setIsCourseConflict] = useState('');
    const [conflictCourseInfo, setConflictCourseInfo] = useState('');
    const [coursePlanName, setCoursePlanName] = useState('');
    const [isOriginalAiRecommendation, setIsOriginalAiRecommendation] =
        useState();

    useEffect(() => {
        if (CoursePlanData.coursePlans?.length > 0) {
            setCoursePlan(CoursePlanData.coursePlans[0]); // TODO: Replace with API data once the APIs are available.
        }
        setRecommendations(Recommendationsdata.recommendations);
        setCourseList(CourseData.Courses);
        window.scrollTo(0, 0); // Scrolling to the top of the page when navigating back from other pages.
    }, []);

    useEffect(() => {
        if (coursePlan?.terms) {
            setAllTerms(
                coursePlan.terms.map(term => ({
                    ...term,
                    courses: [...term.courses]
                }))
            );
        }
    }, [coursePlan]);
    useEffect(() => {
        setTotalCredits(coursePlan?.totalCredits);
    }, [coursePlan]);

    useEffect(() => {
        if (generatedBanners) {
            setBannerQueue(generatedBanners);
        }
        window.scrollTo(0, 0);
    }, [allTerms, courseList]);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 2000); // TODO remove this logic after API integration.
    }, []);

    const generatedBanners = useMemo(() => {
        if (!Array.isArray(allTerms) || allTerms.length === 0) return;
        const banners = [];

        for (const term of allTerms) {
            const termCode = term.code;
            const courses = term.courses ?? [];
            for (const course of courses) {
                //  Check if any of the courses in the corresponding term is not available.
                const courseData = courseList.find(
                    c =>
                        c.subject === course.subject &&
                        c.courseNumber === course.courseNumber
                );

                const availableTerms = courseData?.availableTerms || [];

                if (!availableTerms.includes(termCode)) {
                    banners.push({
                        type: 'warning',
                        title: 'Course Unavailable!',
                        description: `The Course ${course.subject} ${course.courseNumber} - ${course.courseTitle} is not available in ${term.name}.`,
                        isCloseIcon: false,
                        isActionButton: true,
                        onActionResolve: () => {
                            setUnavailableCourseInfo({
                                course,
                                termName: term.name,
                                termCode: term.code
                            });
                            setIsCourseUnavailable(true);
                        },
                        onCourseClick: () => handleHightlightCourse(course)
                    });
                }

                // Check if any of the courses are planned in more than one term.
                const duplicateResult = isCourseDuplicate(course, allTerms);
                if (
                    duplicateResult.duplicate &&
                    duplicateResult.existingTermName !== term.name
                ) {
                    banners.push({
                        type: 'warning',
                        title: 'Course Conflict!',
                        description: `${course.subject} ${course.courseNumber} - ${course.courseTitle} is Currently scheduled in both  ${duplicateResult.existingTermName} and ${term.name}, which creates a conflict.`,
                        isCloseIcon: false,
                        isActionButton: true,
                        onActionResolve: () => {
                            setConflictCourseInfo({
                                course,
                                termName: term.name,
                                duplicateResult
                            });
                            setIsCourseConflict(true);
                        },
                        onCourseClick: () => handleHightlightCourse(course)
                    });
                }

                // 3. Check if the selected course's schedule is conflicting with the schedule of another course which already exists in the target term.
                const otherCourses = term.courses.filter(
                    c => c !== course && c.schedule && course.schedule
                );

                const scheduleConflict = checkScheduleConflict(
                    course,
                    otherCourses
                );

                if (scheduleConflict.conflict) {
                    banners.push({
                        type: 'warning',
                        title: 'Course Schedule Conflict!',
                        description: `The courses ${course.subject} ${course.courseNumber} - ${course.courseTitle} and ${scheduleConflict.conflictCourseName} are having a conflicting schedule.`,
                        isCloseIcon: false,
                        isActionButton: true,
                        onActionResolve: () => {
                            setScheduleConflictOption({
                                otherCourses,
                                course,
                                scheduleConflict
                            });
                            setCourseScheduleDailog(true);
                        },
                        onCourseClick: () => handleHightlightCourse(course)
                    });
                }
            }

            // 4.Check if the total credits of the any of the term is lesser than the minimum credits
            const remainingCredits = term.termCredits;
            if (remainingCredits < term.minimumTermCredits) {
                banners.push({
                    type: 'alerts',
                    title: 'Low Credits!',
                    description: `The required minimum for ${
                        term.name
                    } is short by ${
                        term.minimumTermCredits - remainingCredits
                    } credits.`
                });
            }

            // 5. Low Total Plan Credits Check
            const totalRemainingCredits = totalCredits;
            const minTotalCredits = coursePlan?.minimumTotalCredits ?? 0;

            if (totalRemainingCredits < minTotalCredits) {
                banners.push({
                    type: 'alerts',
                    title: 'Low Credits!',
                    description: `The total credits in the current academic plan do not meet the minimum graduation requirement.`
                });
            }
        }
        return banners;
    }, [allTerms, courseList, coursePlan]);

    function isCourseDuplicate(course, allTerms) {
        for (const term of allTerms) {
            const courses = term.courses ?? [];
            for (const existingCourse of courses) {
                if (
                    course.subject === existingCourse.subject &&
                    course.courseNumber === existingCourse.courseNumber &&
                    course !== existingCourse // skip self-comparison
                ) {
                    return {
                        duplicate: true,
                        existingTermName: term.name
                    };
                }
            }
        }
        return {duplicate: false};
    }

    // function checkScheduleConflict(newCourse, existingCourses) {
    //     if (!Array.isArray(newCourse?.schedule)) return {conflict: false};

    //     for (const existingCourse of existingCourses) {
    //         if (!Array.isArray(existingCourse?.schedule)) continue;

    //         for (const existingSchedule of existingCourse.schedule) {
    //             for (const newSchedule of newCourse.schedule) {
    //                 const existingDays = Array.isArray(existingSchedule.days)
    //                     ? existingSchedule.days
    //                     : typeof existingSchedule.days === 'string'
    //                     ? existingSchedule.days.split(',').map(d => d.trim())
    //                     : [];

    //                 const newDays = Array.isArray(newSchedule.days)
    //                     ? newSchedule.days
    //                     : typeof newSchedule.days === 'string'
    //                     ? newSchedule.days.split(',').map(d => d.trim())
    //                     : [];

    //                 const daysOverlap = newDays.some(day =>
    //                     existingDays.includes(day)
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
    //                             conflictCourseName: `${existingCourse.subject} - ${existingCourse.courseNumber} ${existingCourse.courseTitle}`,
    //                             conflictSchedule: `${existingDays.join(', ')} ${
    //                                 existingSchedule.time
    //                             }`
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

        // Normalize schedule to an array if it's a single object
        const newCourseSchedules = Array.isArray(newCourse.schedule)
            ? newCourse.schedule
            : [newCourse.schedule];

        if (newCourseSchedules.length === 0) {
            console.warn('New course has no schedule:', newCourse);
            return {conflict: false};
        }

        for (const existingCourse of courses) {
            const existingSchedules = Array.isArray(existingCourse.schedule)
                ? existingCourse.schedule
                : [existingCourse.schedule];

            if (existingSchedules.length === 0) continue;

            for (const existingSchedule of existingSchedules) {
                for (const newSchedule of newCourseSchedules) {
                    if (
                        !newSchedule.days ||
                        !newSchedule.time ||
                        !existingSchedule.days ||
                        !existingSchedule.time
                    ) {
                        console.warn('Invalid schedule data:', {
                            newSchedule,
                            existingSchedule
                        });
                        continue;
                    }

                    // Convert days string to array for uniform comparison
                    const newDaysArray = Array.from(newSchedule.days);
                    const existingDaysArray = Array.from(existingSchedule.days);

                    const daysOverlap = newDaysArray.some(day =>
                        existingDaysArray.includes(day)
                    );

                    if (daysOverlap) {
                        const {start: newStart, end: newEnd} =
                            convertToMinutesRange(newSchedule.time);
                        const {start: existingStart, end: existingEnd} =
                            convertToMinutesRange(existingSchedule.time);

                        const timeOverlap =
                            newStart < existingEnd && newEnd > existingStart;

                        if (timeOverlap) {
                            console.warn('Schedule conflict detected:', {
                                newCourse,
                                existingCourse,
                                newSchedule,
                                existingSchedule
                            });

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

    function convertToMinutesRange(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return {start: 0, end: 0};

        const normalizedTimeStr = timeStr.replace(/[–—]/g, '-').trim(); // Handle en dash/em dash too
        const [start, end] = normalizedTimeStr.split('-').map(t => t.trim());

        if (!start || !end) return {start: 0, end: 0};

        const toMinutes = t => {
            const [timePart, modifier] = t.split(' ');
            if (!timePart || !modifier) return 0;

            let [hours, minutes] = timePart.split(':').map(Number);
            if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
            if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

            return hours * 60 + minutes;
        };

        return {
            start: toMinutes(start),
            end: toMinutes(end)
        };
    }

    const toggleIsSaveDialogOpen = () => {
        setIsSaveDialogOpen(prev => !prev);
    };

    const toggleReplaceDailogOpen = () => {
        setIsReplaceDialogOpen(prev => !prev);
    };

    const handleCancel = () => {
        router.back();
    };

    const toggleIsSaveInProgress = isLoading => {
        setIsSaveInProgress(isLoading);
    };

    const handleSave = () => {
        sessionStorage.setItem('hasCoursePlan', 'true');
        toggleIsSaveDialogOpen();
        toggleIsSaveInProgress(true);
        setTimeout(() => {
            toggleIsSaveInProgress(false);
            router.push(`/student/${studentId}`);
        }, 2000); // TODO remove this logic after API integration.
    };

    const addBannerToQueue = banner => {
        setBannerQueue(prev => [...prev, banner]);
    };

    const dismissBanner = indexToRemove => {
        setBannerQueue(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const matchingCourse =
        unavailableCourseInfo &&
        courseList.find(
            c =>
                c.subject === unavailableCourseInfo.course.subject &&
                c.courseNumber === unavailableCourseInfo.course.courseNumber
        );

    const availableTermOptions =
        matchingCourse?.availableTerms?.length > 0
            ? allTerms
                  .filter(term =>
                      matchingCourse.availableTerms.includes(term.code)
                  )
                  .map(term => ({
                      label: term.name,
                      value: term.code
                  }))
            : [];

    const handleCourseUnavailable = (
        conflictCourse,
        currentTermCode,
        availableTermCode
    ) => {
        setAllTerms(prevTerms => {
            const updatedTerms = prevTerms.map(term => {
                const isCurrentTerm = term.code === currentTermCode;
                const isTargetTerm = term.code === availableTermCode;

                // Remove from the current (unavailable) term
                if (isCurrentTerm) {
                    const updatedCourses = term.courses.filter(
                        c =>
                            !(
                                c.courseNumber ===
                                    conflictCourse.courseNumber &&
                                c.subject === conflictCourse.subject
                            )
                    );

                    const updatedCredits =
                        term.termCredits - conflictCourse.credits;

                    return {
                        ...term,
                        courses: updatedCourses,
                        termCredits: Math.max(0, updatedCredits) // Prevent negative credits
                    };
                }

                // Add to the available (target) term
                if (isTargetTerm) {
                    const exists = term.courses.some(
                        c =>
                            c.courseNumber === conflictCourse.courseNumber &&
                            c.subject === conflictCourse.subject
                    );

                    const updatedCourses = exists
                        ? [...term.courses]
                        : [...term.courses, conflictCourse];

                    const updatedCredits = exists
                        ? term.termCredits
                        : term.termCredits + conflictCourse.credits;

                    return {
                        ...term,
                        courses: updatedCourses,
                        termCredits: updatedCredits
                    };
                }

                return {...term};
            });

            // Calculate the total credits
            const newTotalCredits = updatedTerms.reduce(
                (acc, term) => acc + term.termCredits,
                0
            );

            setTotalCredits(newTotalCredits); // Update the totalCredits state

            return updatedTerms;
        });

        // Remove any related banner from queue
        setBannerQueue(prev =>
            prev.filter(
                banner =>
                    !banner.description.includes(conflictCourse.courseNumber)
            )
        );

        setIsCourseUnavailable(false);
        setHighlightedCourse('');
    };

    const handleCourseScheduleConflict = () => {
        if (!scheduleCourseInfo) return;

        const {course, otherCourses} = scheduleCourseInfo;
        const {subject, courseNumber} = course;

        setAllTerms(prevTerms => {
            const updatedTerms = prevTerms.map(term => {
                // Check if the term contains the selected course
                if (
                    term.courses.some(
                        c =>
                            c.subject === subject &&
                            c.courseNumber === courseNumber
                    )
                ) {
                    // Filter out the conflicting courses
                    const updatedCourses = term.courses.filter(c =>
                        c.subject === subject && c.courseNumber === courseNumber
                            ? true // Keep the selected course
                            : !otherCourses.some(
                                  oc =>
                                      oc.subject === c.subject &&
                                      oc.courseNumber === c.courseNumber
                              )
                    );

                    const updatedCredits = updatedCourses.reduce(
                        (total, c) => total + c.credits,
                        0
                    );

                    return {
                        ...term,
                        courses: updatedCourses,
                        termCredits: updatedCredits
                    };
                }

                return term;
            });

            // Calculate and update the total credits across all terms
            const newTotalCredits = updatedTerms.reduce(
                (acc, term) => acc + term.termCredits,
                0
            );
            setTotalCredits(newTotalCredits); // Update the totalCredits state

            return updatedTerms;
        });

        // Remove any related schedule conflict banners from the queue
        setBannerQueue(prev =>
            prev.filter(
                banner =>
                    !banner.description.includes(courseNumber) ||
                    !banner.description.includes(subject)
            )
        );

        setCourseScheduleDailog(false);
        setScheduleConflictOption(null);
        setHighlightedCourse('');
    };

    // const handleCourseConflict = () => {
    //     if (!conflictCourseInfo) return;

    //     const {course, duplicateResult, termName} = conflictCourseInfo;
    //     const {subject, courseNumber} = course;
    //     const {existingTermName} = duplicateResult;

    //     setAllTerms(prevTerms => {
    //         const updatedTerms = prevTerms.map(term => {
    //             // Check if the term is the conflicting one (not the current one)
    //             if (term.name === existingTermName) {
    //                 // Filter out the duplicate course from the conflicting term
    //                 const updatedCourses = term.courses.filter(
    //                     c =>
    //                         !(
    //                             c.subject === subject &&
    //                             c.courseNumber === courseNumber
    //                         )
    //                 );
    //                 const updatedCredits = updatedCourses.reduce(
    //                     (total, c) => total + c.credits,
    //                     0
    //                 );

    //                 return {
    //                     ...term,
    //                     courses: updatedCourses,
    //                     termCredits: updatedCredits
    //                 };
    //             }

    //             return term;
    //         });

    //         // Calculate and update the total credits across all terms
    //         const newTotalCredits = updatedTerms.reduce(
    //             (acc, term) => acc + term.termCredits,
    //             0
    //         );
    //         setTotalCredits(newTotalCredits); // Update the totalCredits state

    //         return updatedTerms;
    //     });

    //     // Remove the conflict banner from the queue
    //     setBannerQueue(prev =>
    //         prev.filter(
    //             banner =>
    //                 !banner.description.includes(courseNumber) ||
    //                 !banner.description.includes(subject)
    //         )
    //     );

    //     setIsCourseConflict(false);
    //     setConflictCourseInfo(null);
    //     setHighlightedCourse('');
    // };
    const handleCourseConflict = () => {
        if (!conflictCourseInfo) return;

        const {course, duplicateResult} = conflictCourseInfo;
        const {subject, courseNumber, courseTitle} = course;
        const {existingTermName} = duplicateResult;

        setAllTerms(prevTerms => {
            return prevTerms.map(term => {
                if (term.name === existingTermName) {
                    const updatedCourses = term.courses.filter(c => {
                        const isConflictCourse =
                            c.subject === subject &&
                            c.courseNumber === courseNumber;

                        // If it's a conflict course, keep only the selected course
                        if (isConflictCourse) {
                            return c.courseTitle === courseTitle;
                        }

                        // For non-conflicting courses, keep them as they are
                        return true;
                    });

                    const updatedCredits = updatedCourses.reduce(
                        (total, c) => total + c.credits,
                        0
                    );

                    return {
                        ...term,
                        courses: updatedCourses,
                        termCredits: updatedCredits
                    };
                }

                return term;
            });
        });

        // Recalculate total credits
        setTotalCredits(prevTerms => {
            return prevTerms.reduce((acc, term) => acc + term.termCredits, 0);
        });

        // Remove conflict banner
        setBannerQueue(prev =>
            prev.filter(
                banner =>
                    !banner.description.includes(courseNumber) ||
                    !banner.description.includes(subject)
            )
        );

        setIsCourseConflict(false);
        setConflictCourseInfo(null);
        setHighlightedCourse('');
    };

    const handleHightlightCourse = course => {
        const courseId = `course-${course.subject}-${course.courseNumber}`;
        const element = document.getElementById(courseId);

        if (element) {
            element.scrollIntoView({behavior: 'smooth', block: 'center'});
            setHighlightedCourse(`${course.subject}-${course.courseNumber}`);
        }
    };

    const handleReplacePlan = () => {
        setSelectReplaceOption('');
        setIsReplaceDialogOpen(false);
        router.push(studentProfilePath);
    };

    return (
        <Box className={classes.infinize__coursePlanRecommendationsPage}>
            <Typography variant="h2" color="primary">
                Course Plan Recommendations
            </Typography>
            {!isLoading &&
                bannerQueue.map((banner, index) => (
                    <CoursePlanBanners
                        key={index}
                        type={banner.type}
                        title={banner.title}
                        description={banner.description}
                        onAction={() => dismissBanner(index)}
                        isCloseIcon={banner.isCloseIcon}
                        isActionButton={banner.isActionButton}
                        onActionResolve={banner.onActionResolve}
                        onCourseClick={banner.onCourseClick}
                    />
                ))}

            <Box
                className={classes.infinize__coursePlanRecommendationsAlignment}
            >
                <Stack
                    direction={{sm: 'column', md: 'row'}}
                    spacing={2}
                    width="100%"
                >
                    <CoursePlanCard
                        coursePlan={coursePlan}
                        isLoading={isLoading}
                        onRestart={onRestart}
                        addBannerToQueue={addBannerToQueue}
                        setBannerQueue={setBannerQueue}
                        allTerms={allTerms}
                        setAllTerms={setAllTerms}
                        highlightedCourse={highlightedCourse}
                        setHighlightedCourse={setHighlightedCourse}
                        totalCredits={totalCredits}
                        setTotalCredits={setTotalCredits}
                        isOriginalAiRecommendation={isOriginalAiRecommendation}
                        setIsOriginalAiRecommendation={
                            coursePlan?.isOriginalAiRecommendation
                        }
                    />
                    <AdditionalRecommendations
                        recommendations={recommendations}
                        isEditMode={true}
                        isLoading={isLoading}
                    />
                </Stack>
            </Box>
            {!isLoading && (
                <Box className={classes.infinize__coursePlanCardButtons}>
                    <ActionButtons
                        onSave={() => {
                            if (CoursePlanData.coursePlans?.length === 3) {
                                console.log('hello');
                                toggleReplaceDailogOpen();
                            } else {
                                toggleIsSaveDialogOpen();
                            }
                        }}
                        onCancel={handleCancel}
                    />
                </Box>
            )}
            {isSaveInProgress && <Loader isOpen={isSaveInProgress} />}

            {/* Save Dialog */}
            {isSaveDialogOpen && (
                <InfinizeDialog
                    isOpen
                    onClose={() => setIsSaveDialogOpen(false)}
                    title="Plan Name"
                    contentText="Enter a name to save the plan."
                    primaryButtonLabel="Save"
                    onPrimaryButtonClick={handleSave}
                    isPrimaryButtonDisabled={!coursePlanName}
                >
                    <TextInput
                        name="planName"
                        label="Enter Plan Name"
                        value={coursePlanName}
                        onChange={setCoursePlanName}
                    />
                </InfinizeDialog>
            )}

            {/* Replace Paln Dialog */}
            {isReplaceDialogOpen && (
                <InfinizeDialog
                    isOpen
                    onClose={() => setIsReplaceDialogOpen(false)}
                    title="Alert!"
                    contentText="You have three plans saved already. To create a new one, you’ll need to replace one of the existing plans."
                    primaryButtonLabel="Continue"
                    onPrimaryButtonClick={handleReplacePlan}
                    isPrimaryButtonDisabled={!selectReplaceOption}
                >
                    <Box>
                        <Typography fontSize="16px" fontWeight="500">
                            Which plan would you like to replace?
                        </Typography>
                        <RadioGroupField
                            name="coursePlanReplace"
                            label="Study Abroad or Exchange Opportunities"
                            value={selectReplaceOption}
                            options={CoursePlanData.coursePlans.map(
                                plan => plan.name
                            )}
                            onChange={setSelectReplaceOption}
                        />
                    </Box>
                </InfinizeDialog>
            )}

            <CoursePlanDialogs
                isCourseUnavailable={isCourseUnavailable}
                setIsCourseUnavailable={setIsCourseUnavailable}
                courseUnavailableText={
                    unavailableCourseInfo &&
                    `The Course ${unavailableCourseInfo.course.subject} ${unavailableCourseInfo.course.courseNumber} - ${unavailableCourseInfo.course.courseTitle} is not available in ${unavailableCourseInfo.termName}.`
                }
                availableTermOptions={availableTermOptions}
                selectUnavailableOption={selectUnavailableOption}
                setSelectUnavailableOption={setSelectUnavailableOption}
                handleCourseUnavailable={() =>
                    handleCourseUnavailable(
                        unavailableCourseInfo.course,
                        unavailableCourseInfo.termCode,
                        selectUnavailableOption
                    )
                }
                courseScheduleDailog={courseScheduleDailog}
                setCourseScheduleDailog={setCourseScheduleDailog}
                scheduleDescription={
                    scheduleCourseInfo &&
                    scheduleCourseInfo.course &&
                    scheduleCourseInfo.scheduleConflict
                        ? `The courses ${scheduleCourseInfo.course.subject} ${scheduleCourseInfo.course.courseNumber} - ${scheduleCourseInfo.course.courseTitle} and ${scheduleCourseInfo.scheduleConflict.conflictCourseName} are scheduled at the same time: (${scheduleCourseInfo.scheduleConflict.conflictSchedule}).`
                        : ''
                }
                conflictOptions={
                    scheduleCourseInfo?.course &&
                    scheduleCourseInfo.scheduleConflict
                        ? [
                              `${scheduleCourseInfo.course.subject} ${scheduleCourseInfo.course.courseNumber} - ${scheduleCourseInfo.course.courseTitle}\n(${scheduleCourseInfo.scheduleConflict.conflictCourseName} will be removed from this term)`,
                              `${scheduleCourseInfo.scheduleConflict.conflictCourseName}\n(${scheduleCourseInfo.course.subject} ${scheduleCourseInfo.course.courseNumber} will be removed and can be rescheduled if any alternate slot is available)`
                          ]
                        : []
                }
                onScheduleConflictDecision={handleCourseScheduleConflict}
                isCourseConflict={isCourseConflict}
                setIsCourseConflict={setIsCourseConflict}
                courseConflictText={
                    conflictCourseInfo &&
                    `${conflictCourseInfo.course.subject} ${conflictCourseInfo.course.courseNumber} - ${conflictCourseInfo.course.courseTitle} is currently scheduled in both ${conflictCourseInfo.duplicateResult.existingTermName} and ${conflictCourseInfo.termName}, which creates a conflict.`
                }
                courseConflictLabel={
                    conflictCourseInfo &&
                    `Would you like to move it to ${conflictCourseInfo.termName} instead?`
                }
                conflictCourseOptions={
                    conflictCourseInfo && [
                        `Yes, Move to ${conflictCourseInfo.termName} \n (The course will be rescheduled from ${conflictCourseInfo.duplicateResult.existingTermName} to ${conflictCourseInfo.termName})`,
                        `No, keep in ${conflictCourseInfo.duplicateResult.existingTermName} \n (No changes will be made)`
                    ]
                }
                onCourseConflict={handleCourseConflict}
            />
        </Box>
    );
}
