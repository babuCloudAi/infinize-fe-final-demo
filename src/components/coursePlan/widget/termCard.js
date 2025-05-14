import {Typography, Box, Stack} from '@mui/material';
import classes from '../coursePlan.module.css';

export default function TermCard({term}) {
    return (
        <Box
            className={classes.infinize__coursePlanLandingCard}
            sx={{width: {lg: '35%', md: '50%', sm: '75%', xs: '100%'}}}
        >
            <Box className={classes.infinize__coursePlanTermHeading}>
                <Typography variant="h6">{term.name}</Typography>
                <Typography variant="subtitle1">
                    Total Credits: {term.termCredits}
                </Typography>
            </Box>
            <Stack spacing={2}>
                {term.courses?.map((course, idx) => (
                    <Box
                        key={idx}
                        className={classes.infinize__coursePlanCourseItem}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            {`${course.subject} ${course.courseNumber} ${course.courseTitle}`}
                        </Typography>
                        <Typography variant="body2">
                            {course.description}
                        </Typography>
                        <Typography variant="body2">
                            Credits: {course.credits}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
