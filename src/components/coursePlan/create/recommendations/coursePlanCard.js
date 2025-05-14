import {Box, Skeleton} from '@mui/material';
import classes from '../../coursePlan.module.css';
import CoursePlan from './coursePlan';

export default function CoursePlanCard({
    isLoading,

    coursePlan,

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
    return (
        <Box
            className={classes.infinize__coursePlanCards}
            width={{md: '66%', sm: '100%'}}
        >
            <Box className={classes.infinize__coursePlanCardWithButtons}>
                {isLoading && (
                    <Box width="100%" padding={2}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={100}
                        />
                        <Box mt={2} />
                        <Skeleton variant="heading" width="100%" height={30} />
                        <Box mt={2} />
                        <Skeleton variant="text" width="100%" height={40} />
                        <Skeleton variant="text" width="100%" height={40} />
                        <Skeleton variant="text" width="100%" height={40} />
                        <Skeleton variant="text" width="100%" height={40} />
                        <Box mt={2} />
                        <Skeleton variant="heading" width="100%" height={30} />
                        <Box mt={2} />
                        <Skeleton variant="text" width="100%" height={40} />
                        <Skeleton variant="text" width="100%" height={40} />
                        <Skeleton variant="text" width="100%" height={40} />
                        <Skeleton variant="text" width="100%" height={40} />
                        <Box mt={2} />
                        <Skeleton variant="heading" width="100%" height={30} />
                        <Box mt={2} />
                        <Skeleton variant="text" width="100%" height={40} />
                    </Box>
                )}
                {!isLoading && coursePlan && (
                    <CoursePlan
                        coursePlan={coursePlan}
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
                            setIsOriginalAiRecommendation
                        }
                    />
                )}
            </Box>
        </Box>
    );
}
