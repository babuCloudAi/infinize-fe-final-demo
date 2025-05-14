'use client';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Stack,
    IconButton,
    useTheme
} from '@mui/material';
import {InfinizeDialog, InfinizeIcon} from '../../../common';
import {InfinizeConfirmation} from '../../../common';
import classes from '../../coursePlan.module.css';
import {useState, useEffect} from 'react';
import coursesData from '@/data/coursePlan/courses.json';
import AddCourse from './addCourse';
import CourseAccordion from './courseAccordion';
import CoursePlanDialogs from './dialogs';

export default function TermsAccordion({
    planId,
    term,
    termIndex,
    expanded,
    toggleAccordion,
    allTerms,
    setAllTerms,
    isOriginalAiRecommendation,
    setIsOriginalAiRecommendation,
    addBannerToQueue,
    coursePlan,
    highlightedCourse,
    setHighlightedCourse,
    totalCredits,
    setTotalCredits
}) {
    const theme = useTheme();
    const [coursePlanData, setCoursePlanData] = useState(coursePlan);
    const [coursesList, setCoursesList] = useState([]);
    const [isAddMode, setIsAddMode] = useState(false);
    const [selectedNewCourse, setSelectedNewCourse] = useState(null);

    const [isTermDeleteDialogOpen, setIsTermDeleteDialogOpen] = useState(false);
    const [showTotalLowCreditsAlert, setShowTotalLowCreditsAlert] =
        useState(false);
    const [deleteTermName, setDeleteTermName] = useState('');

    useEffect(() => {
        setCoursesList(coursesData.Courses); // Replace with API later
    }, []);

    // Toggle helpers
    const toggle = setter => () => setter(prev => !prev);
    const toggleAddMode = toggle(setIsAddMode);
    const toggleTotalCreditsAlert = toggle(setShowTotalLowCreditsAlert);

    const handleTermDelete = (event, term) => {
        event.stopPropagation();
        setIsTermDeleteDialogOpen(true);
        setDeleteTermName(term.name);
    };

    const handleTermDeleteConfirmation = () => {
        const updatedTerms = allTerms.filter(
            term => term.name !== deleteTermName
        );
        const termToDelete = allTerms.find(
            term => term.name === deleteTermName
        );
        const deletedTermCredits = termToDelete?.termCredits || 0;
        const updatedTotalCredits = totalCredits - deletedTermCredits;
        setTotalCredits(updatedTotalCredits);

        setAllTerms(updatedTerms);

        // Optional: Recalculate total credits and alerts

        const isBelowMinTotalCredits =
            updatedTotalCredits < coursePlanData.minimumTotalCredits;
        if (isBelowMinTotalCredits) {
            toggleTotalCreditsAlert();
        }
        setIsTermDeleteDialogOpen(false);
        setDeleteTermName('');
    };

    const handleAddCourse = (selectedCourse, selectedTermCode) => {
        if (!selectedCourse) return;

        const courseToAdd = coursesList.find(
            course => course.courseNumber === selectedCourse.courseNumber
        );

        if (!courseToAdd) return;

        const newCourse = {
            subject: selectedCourse.subject,
            courseNumber: selectedCourse.courseNumber,
            courseTitle: selectedCourse.courseTitle,
            credits: selectedCourse.credits,
            description: selectedCourse.description,
            schedule: selectedCourse.schedule || []
        };

        // Update terms without triggering a full render
        const updatedTerms = allTerms.map(term =>
            term.code === selectedTermCode
                ? {
                      ...term,
                      courses: [...(term.courses || []), newCourse],
                      termCredits: (term.termCredits || 0) + newCourse.credits
                  }
                : term
        );

        const updatedTotalCredits = totalCredits + newCourse.credits;

        setAllTerms(updatedTerms);
        setTotalCredits(updatedTotalCredits);
        setSelectedNewCourse(null);
        setIsAddMode(false);
    };

    return (
        <Accordion
            expanded={expanded[`${term.code}-${termIndex}`] || false}
            onChange={() => toggleAccordion(term.code, termIndex)}
            disableGutters
            sx={{mt: 1, width: '100%', boxShadow: 'none'}}
        >
            <AccordionSummary
                expandIcon={
                    <InfinizeIcon
                        icon={
                            expanded[`${term.code}-${termIndex}`]
                                ? 'lucide-circle-minus'
                                : 'lucide-circle-plus'
                        }
                        style={{color: theme.palette.primary.main}}
                        aria-hidden="true"
                    />
                }
                aria-controls={`term-content-${term.code}-${termIndex}`}
                id={`coursePlan__term_accordion_${termIndex}`}
                className={classes.infinize__coursePlanCardAccordion}
            >
                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    justifyContent="space-between"
                    alignItems={{xs: 'flex-start', sm: 'center'}}
                    width="97%"
                >
                    <Typography variant="h6" color="primary">
                        {term.name}
                    </Typography>
                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                        <Typography
                            color="primary"
                            fontSize={12}
                            fontWeight={500}
                        >
                            {term.termCredits || 0} Credits
                        </Typography>
                        <IconButton
                            component="span"
                            onClick={event => handleTermDelete(event, term)}
                        >
                            <InfinizeIcon
                                icon="fluent-delete-24-filled"
                                style={{color: theme.palette.primary.main}}
                                width={'20px'}
                                height={'20px'}
                            />
                        </IconButton>
                    </Stack>
                </Stack>
            </AccordionSummary>

            <AccordionDetails
                id={`term-content-${term.code}-${termIndex}`}
                className={classes.infinize__coursePlanCardAccordionDetails}
                sx={{boxShadow: 'none'}}
            >
                {term?.courses?.map((course, idx) => (
                    <CourseAccordion
                        key={idx}
                        course={course}
                        idx={idx}
                        term={term}
                        planId={planId}
                        termIndex={termIndex}
                        allTerms={allTerms}
                        setAllTerms={setAllTerms}
                        highlightedCourse={highlightedCourse}
                        setTotalCredits={setTotalCredits}
                        coursesList={coursesList}
                        addBannerToQueue={addBannerToQueue}
                    />
                ))}

                {isAddMode ? (
                    <AddCourse
                        courses={coursesList}
                        onCourseSelect={setSelectedNewCourse}
                        onAdd={() =>
                            handleAddCourse(selectedNewCourse, term.code)
                        }
                        onClose={toggleAddMode}
                        selectedTerm={term}
                        allTerms={allTerms}
                        addBannerToQueue={addBannerToQueue}
                        setHighlightedCourse={setHighlightedCourse}
                    />
                ) : (
                    <Button
                        variant="text"
                        fullWidth
                        onClick={() => toggleAddMode(termIndex)}
                        className={classes.infinize__coursePlanAddButton}
                    >
                        + Add
                    </Button>
                )}
            </AccordionDetails>

            {/* Delete Term Dailog */}
            {isTermDeleteDialogOpen && (
                <InfinizeConfirmation
                    isOpen
                    onClose={() => setIsTermDeleteDialogOpen(false)}
                    primaryButtonLabel="Delete"
                    onConfirm={handleTermDeleteConfirmation}
                    title="Confirm Term Deletion"
                    content={`Are you sure you want to delete the Term “${deleteTermName}”?. \n All associated courses will also be removed.`}
                />
            )}
        </Accordion>
    );
}
