'use client';
import {useState, useEffect} from 'react';
import {Typography, Box, Stack, useTheme} from '@mui/material';
import {InfinizeIcon, RationaleDialog} from '../../../common';
import classes from '../../coursePlan.module.css';
import TermsAccordion from './termsAccordion';
import Link from 'next/link';
import CoursePlanMenu from './coursePlanMenu';

export default function CoursePlan({
    coursePlan = {},

    onRestart,
    addBannerToQueue,
    setBannerQueue,
    allTerms,
    setAllTerms,
    highlightedCourse,
    setHighlightedCourse,
    totalCredits,
    setTotalCredits,
    isOriginalAiRecommendation,
    setIsOriginalAiRecommendation
}) {
    const theme = useTheme();

    const [expanded, setExpanded] = useState({});
    const [isRationaleDialogOpen, setIsRationaleDialogOpen] = useState(false);

    const toggleIsRationaleDialogOpen = () => {
        setIsRationaleDialogOpen(prev => !prev);
    };

    useEffect(() => {
        const terms = coursePlan?.terms || [];
        setAllTerms(terms);
        const initialExpanded = {};
        coursePlan?.terms?.forEach((term, termIndex) => {
            initialExpanded[`${term.code}-${termIndex}`] = termIndex === 0;
        });
        setExpanded(initialExpanded);
    }, [coursePlan]);

    const toggleAccordion = (term, termIndex) => {
        setExpanded(prev => ({
            ...prev,
            [`${term}-${termIndex}`]: !prev[`${term}-${termIndex}`]
        }));
    };

    const expandAll = () => {
        const newExpandedState = {};
        coursePlan.terms.forEach((term, termIndex) => {
            newExpandedState[`${term.code}-${termIndex}`] = true;
        });
        setExpanded(newExpandedState);
    };

    const collapseAll = () => {
        const newExpandedState = {};
        coursePlan.terms.forEach((term, termIndex) => {
            newExpandedState[`${term.code}-${termIndex}`] = false;
        });
        setExpanded(newExpandedState);
    };

    const handleRestart = () => {
        onRestart();
    };

    return (
        <Box className={classes.infinize__coursePlanCard}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                className={classes.infinize__coursePlanCardMenuIcon}
            >
                <Link
                    href=""
                    onClick={e => {
                        e.preventDefault();
                        toggleIsRationaleDialogOpen();
                    }}
                    className={classes.infinize__coursePlanCardRationaleLink}
                >
                    View Rationale
                </Link>
                <CoursePlanMenu
                    onExpandAll={expandAll}
                    onCollapseAll={collapseAll}
                    onRestart={handleRestart}
                    setAllTerms={setAllTerms}
                    initialTerms={coursePlan?.terms}
                    clearBanners={() => setBannerQueue([])}
                    initialTotalCredits={coursePlan?.totalCredits}
                    setTotalCredits={setTotalCredits}
                />
            </Stack>

            <Box className="infinize__IconOuter">
                <InfinizeIcon
                    icon="fluent:hat-graduation-sparkle-24-filled"
                    style={{color: theme.palette.primary.main}}
                />
            </Box>

            <Typography variant="h2" color="primary">
                Plan
            </Typography>

            <Typography
                variant="body1"
                className={classes.infinize__coursePlanTotalCredits}
            >
                Total Credits: {totalCredits}
            </Typography>

            {allTerms.map((term, termIndex) => (
                <TermsAccordion
                    key={termIndex}
                    planId={coursePlan.id}
                    term={term}
                    termIndex={termIndex}
                    expanded={expanded}
                    toggleAccordion={toggleAccordion}
                    allTerms={allTerms}
                    setAllTerms={setAllTerms}
                    termsData={coursePlan.terms}
                    addBannerToQueue={addBannerToQueue}
                    coursePlan={coursePlan}
                    highlightedCourse={highlightedCourse}
                    setHighlightedCourse={setHighlightedCourse}
                    totalCredits={totalCredits}
                    setTotalCredits={setTotalCredits}
                    isOriginalAiRecommendation={isOriginalAiRecommendation}
                    setIsOriginalAiRecommendation={
                        setIsOriginalAiRecommendation
                    }
                />
            ))}
            {isRationaleDialogOpen && (
                <RationaleDialog
                    isOpen={isRationaleDialogOpen}
                    onClose={() => toggleIsRationaleDialogOpen()}
                    title="AI rationale for generated course plan"
                    contentUrl="/coursePlan/rationaleContent.md"
                    isOriginalAiRecommendation={isOriginalAiRecommendation}
                />
            )}
        </Box>
    );
}
