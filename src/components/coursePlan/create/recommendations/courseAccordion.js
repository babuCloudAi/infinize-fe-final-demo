'use client';

import {useState} from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {InfinizeIcon} from '../../../common';
import classes from '../../coursePlan.module.css';
import CourseMenu from './courseMenu';

export default function CourseAccordion({
    course,
    idx,
    term,
    termIndex,
    allTerms,
    setAllTerms,
    highlightedCourse,
    setTotalCredits,
    coursesList,
    addBannerToQueue
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [nestedExpanded, setNestedExpanded] = useState(null);

    const handleAccordionToggle = () => {
        setNestedExpanded(prev =>
            prev === `${termIndex}-${idx}` ? false : `${termIndex}-${idx}`
        );
    };

    return (
        <Accordion
            expanded={nestedExpanded === `${termIndex}-${idx}`}
            onChange={handleAccordionToggle}
            disableGutters
            sx={{
                mb: 1,
                boxShadow: 'none',
                border:
                    highlightedCourse ===
                    `${course.subject}-${course.courseNumber}`
                        ? '1px solid #F4B0A1'
                        : '',
                backgroundColor:
                    highlightedCourse ===
                    `${course.subject}-${course.courseNumber}`
                        ? '#FFF5F3'
                        : '#f2f4f5'
            }}
            id={`course-${course.subject}-${course.courseNumber}`}
            className={classes.infinize__coursePlanNestedAccordionSummary}
        >
            <AccordionSummary
                expandIcon={
                    <InfinizeIcon
                        icon="mdi:expand-more"
                        className="menuItemIcon"
                    />
                }
            >
                <Stack
                    className={classes.infinize__coursePlanCardAccordionValue}
                    direction={{xs: 'column', sm: 'row'}}
                    width="100%"
                >
                    <Stack direction={'row'}>
                        <Stack>
                            <Typography textAlign="left">
                                {`${course.subject} ${course.courseNumber} ${course.courseTitle}`}
                            </Typography>

                            <Stack
                                direction={{sm: 'column', md: 'row'}}
                                spacing={{xs: 0.5, sm: 1.5}}
                            >
                                {course.schedule && (
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
                                            {course.schedule.days}
                                        </Typography>
                                        <Typography variant="body2">
                                            {course.schedule.time}
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>

                        {isMobile && (
                            <CourseMenu
                                course={course}
                                allTerms={allTerms}
                                setAllTerms={setAllTerms}
                                term={term}
                            />
                        )}
                    </Stack>

                    <Stack
                        direction="row"
                        alignItems={{xs: 'flex-start', sm: 'center'}}
                        spacing={{xs: 6, sm: 1}}
                        width={{xs: '100%', sm: '25%'}}
                        justifyContent={{xs: 'flex-start', sm: 'flex-end'}}
                    >
                        <Typography fontSize={12} fontWeight={500}>
                            {course.credits} Credits
                        </Typography>
                        {!isMobile && (
                            <CourseMenu
                                course={course}
                                allTerms={allTerms}
                                setAllTerms={setAllTerms}
                                term={term}
                                setTotalCredits={setTotalCredits}
                                coursesList={coursesList}
                                addBannerToQueue={addBannerToQueue}
                            />
                        )}
                    </Stack>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Typography className={classes.infinize__coursePlanDescription}>
                    {course.description}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}
