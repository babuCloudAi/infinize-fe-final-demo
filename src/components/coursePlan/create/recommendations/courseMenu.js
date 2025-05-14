'use client';
import {useState, useEffect} from 'react';
import {Menu, MenuItem, ListItemIcon, IconButton} from '@mui/material';
import {InfinizeConfirmation, InfinizeIcon} from '../../../common';
import CoursePlanDialogs from './dialogs';

export default function CourseMenu({
    course,
    term,
    allTerms,
    setAllTerms,
    setTotalCredits,
    coursesList,
    addBannerToQueue
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [moveMenuAnchor, setMoveMenuAnchor] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSourceTerm, setSelectedSourceTerm] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [conflictCourseName, setConflictCourseName] = useState('');
    const [courseScheduleConflictAlert, setCourseScheduleConflictAlert] =
        useState(false);
    const [conflictSchedule, setConflictSchedule] = useState('');
    const [courseScheduleDailog, setCourseScheduleDailog] = useState(false);
    const [conflictOptions, setConflictOptions] = useState([]);
    const [selectedTermName, setSelectedTermName] = useState('');
    const [lowCreditsValue, setLowCreditsValue] = useState(null);

    const toggle = setter => () => setter(prev => !prev);

    const toggleDeleteDialog = toggle(setIsDeleteDialogOpen);

    const closeMenu = setter => () => setter(null);

    const handleMenuOpen = (event, course, term) => {
        event.stopPropagation();
        setSelectedCourse(course);
        setSelectedSourceTerm(term);
        setAnchorEl(event.currentTarget);
    };

    const handleDelete = event => {
        event.stopPropagation();
        setAnchorEl(null);
        toggleDeleteDialog();
    };

    const handleDeleteCourse = event => {
        event.stopPropagation();
        setAnchorEl(null);

        if (!selectedCourse || !selectedSourceTerm) return;

        const updatedTerms = allTerms.map(term => {
            if (term.term !== selectedSourceTerm.term) return term;

            const courseToDelete = term.courses?.find(
                c =>
                    c.courseNumber === selectedCourse.courseNumber &&
                    c.subject === selectedCourse.subject
            );
            const updatedCourses =
                term.courses?.filter(
                    c =>
                        !(
                            c.subject === selectedCourse.subject &&
                            c.courseNumber === selectedCourse.courseNumber
                        )
                ) || [];

            const updatedCredits = courseToDelete
                ? term.termCredits - courseToDelete.credits
                : term.termCredits;

            return {
                ...term,
                courses: updatedCourses,
                termCredits: updatedCredits
            };
        });

        // Recalculate total credits after course deletion
        const totalRemainingCredits = updatedTerms.reduce(
            (sum, term) => sum + (term.termCredits || 0),
            0
        );

        setTotalCredits(totalRemainingCredits);
        setAllTerms(updatedTerms);
        toggleDeleteDialog();
    };

    const closeAllMenus = () => {
        setAnchorEl(null);
        setMoveMenuAnchor(null);
    };

    const handleMove = (event, destinationTerm) => {
        event.stopPropagation();
        closeAllMenus();

        if (!selectedCourse || !selectedSourceTerm || !destinationTerm) return;

        const courseToMove = selectedSourceTerm?.courses?.find(
            course =>
                course.courseNumber === selectedCourse.courseNumber &&
                course.subject === selectedCourse.subject
        );

        if (!courseToMove) return;

        // Move course to destination term
        const updatedTerms = allTerms.map(term => {
            if (term.name === selectedSourceTerm.name) {
                return {
                    ...term,
                    courses: term.courses.filter(
                        c =>
                            !(
                                c.subject === courseToMove.subject &&
                                c.courseNumber === courseToMove.courseNumber
                            )
                    ),
                    termCredits: term.termCredits - courseToMove.credits
                };
            }
            if (term.name === destinationTerm.label) {
                return {
                    ...term,
                    courses: [...(term.courses || []), courseToMove],
                    termCredits: term.termCredits + courseToMove.credits
                };
            }
            return term;
        });

        setAllTerms(updatedTerms);

        // === Low Credits Check AFTER Move ===
        const updatedSourceTerm = updatedTerms.find(
            t => t.name === selectedSourceTerm.name
        );
        const remainingCredits = updatedSourceTerm?.termCredits ?? 0;
        const lowCreditsDifference =
            selectedSourceTerm.minimumTermCredits - remainingCredits;

        if (lowCreditsDifference > 0) {
            setLowCreditsValue(lowCreditsDifference);
            window.scrollTo(0, 0);
            addBannerToQueue({
                type: 'alerts',
                title: 'Low Credits Warning',
                description: `${updatedSourceTerm.name} is short by ${lowCreditsDifference} credits.`,
                autoClose: false
            });
        }

        // === Course Schedule Conflict Check ===
        const updatedDestinationTerm = updatedTerms.find(
            t => t.name === destinationTerm.label
        );

        if (!updatedDestinationTerm) {
            console.warn(
                `Destination term not found: ${destinationTerm.label}`
            );
            return;
        }

        const scheduleConflictResult = checkScheduleConflict(
            courseToMove,
            updatedDestinationTerm.courses
        );

        if (scheduleConflictResult.conflict) {
            setConflictCourseName(scheduleConflictResult.conflictCourseName);
            setConflictSchedule(scheduleConflictResult.conflictSchedule);
            setCourseScheduleConflictAlert(true);
            setSelectedCourse('');
            setConflictOptions([
                scheduleConflictResult.conflictCourseName,
                selectedCourse
            ]);
            addBannerToQueue({
                type: 'warning',
                title: 'Schedule Conflict Detected',
                description: `The course ${selectedCourse.subject} ${selectedCourse.courseNumber} conflicts with ${scheduleConflictResult.conflictCourseName} on ${scheduleConflictResult.conflictSchedule}.`,
                autoClose: false,
                onActionResolve: handleScheduleConflictAction
            });
        }
    };

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

    const getAvailableTermOptions = course => {
        if (!course) return [];

        const matchingCourse = coursesList.find(
            c =>
                c.subject === course.subject &&
                c.courseNumber === course.courseNumber
        );

        return matchingCourse?.availableTerms?.length > 0
            ? allTerms
                  .filter(term =>
                      matchingCourse.availableTerms.includes(term.code)
                  )
                  .map(term => ({
                      label: term.name,
                      value: term.code
                  }))
            : [];
    };

    useEffect(() => {
        if (courseScheduleConflictAlert) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            addBannerToQueue({
                type: 'warning',
                title: 'Course schedule conflict!',
                description: `The courses ${selectedCourse} and ${conflictCourseName} are scheduled at the same time: ${conflictSchedule} in ${selectedTermName}`,
                isCloseIcon: false,
                isActionButton: true,
                onActionResolve: handleScheduleConflictAction,
                onCourseClick: () => handleHightlightCourse(selectedCourse)
            });
        }
    }, [
        courseScheduleConflictAlert,
        selectedCourse,
        conflictCourseName,
        conflictSchedule,
        selectedTermName
    ]);

    return (
        <>
            <IconButton
                component="span" // To prevent the error like <button> cannot be a descendant of <button> making the component as span
                onClick={event => handleMenuOpen(event, course, term)}
                sx={{
                    padding: 0,
                    '&:hover': {
                        backgroundColor: 'transparent'
                    },
                    transform: {
                        xs: 'translateY(14px)', // Apply on small screens to display the menu icon center vertically
                        sm: 'none'
                    }
                }}
            >
                <InfinizeIcon
                    icon="mi:options-vertical"
                    className="menuIcon"
                    height="20px"
                />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu(setAnchorEl)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'left'}}
                className="menu"
            >
                <MenuItem
                    onClick={event => {
                        event.stopPropagation();
                        setMoveMenuAnchor(anchorEl);
                        setSelectedCourse(course);
                    }}
                    className="menuItem"
                >
                    <ListItemIcon>
                        <InfinizeIcon icon="material-symbols:move-up-rounded" />
                    </ListItemIcon>
                    Move to
                </MenuItem>
                <MenuItem onClick={handleDelete} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon icon="fluent:delete-24-filled" />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>

            <Menu
                anchorEl={moveMenuAnchor}
                open={Boolean(moveMenuAnchor)}
                onClose={closeMenu(setMoveMenuAnchor)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'left'}}
                sx={{
                    '& .MuiPaper-root': {
                        marginLeft: '210px',
                        marginTop: '-20px'
                    }
                }}
                className="menu"
            >
                {selectedCourse &&
                getAvailableTermOptions(selectedCourse).filter(
                    termOption => termOption.value !== selectedSourceTerm?.code
                ).length === 0
                    ? [
                          <MenuItem
                              key="no-options"
                              disabled
                              className="menuItem"
                          >
                              No options available
                          </MenuItem>
                      ]
                    : getAvailableTermOptions(selectedCourse)
                          .filter(
                              termOption =>
                                  termOption.value !== selectedSourceTerm?.code
                          )
                          .map((termOption, index) => (
                              <MenuItem
                                  key={index}
                                  onClick={event =>
                                      handleMove(event, termOption)
                                  }
                                  className="menuItem"
                              >
                                  {termOption.label}
                              </MenuItem>
                          ))}
            </Menu>

            {isDeleteDialogOpen && (
                <InfinizeConfirmation
                    isOpen
                    onClose={toggleDeleteDialog}
                    onConfirm={event => {
                        handleDeleteCourse(event);
                    }}
                    primaryButtonLabel="Continue"
                    title="Confirm Course Deletion"
                    content={`Are you sure you want to delete the course "${selectedCourse.subject} ${selectedCourse.courseNumber} ${selectedCourse.courseTitle}"`}
                />
            )}

            <CoursePlanDialogs
                courseScheduleDailog={courseScheduleDailog}
                setCourseScheduleDailog={setCourseScheduleDailog}
                scheduleDescription={`The courses ${selectedCourse} and ${conflictCourseName} are scheduled at the same time: ${conflictSchedule} in ${selectedTermName}`}
                conflictOptions={conflictOptions}
                onScheduleConflictDecision={() =>
                    setCourseScheduleDailog(false)
                }
            />
        </>
    );
}
