'use client';
import {Box, Typography, Stack} from '@mui/material';
import styles from '../../career.module.css';
import SaveStatus from './saveStatus';

export default function CareersList({
    careers = [],
    selectedCareerIndex,
    oncareerSelect,
    isSaved,
    isSaving,
    onSave
}) {
    return (
        <Stack
            className={styles.infinize__jobRecommendationsEditCards}
            sx={{width: {md: '100%', lg: '35%'}}}
            gap={2}
        >
            {careers.map((career, index) => {
                return (
                    <Box
                        key={index}
                        className={`${
                            styles.infinize__jobRecommendationsCard
                        } ${
                            selectedCareerIndex === index
                                ? styles.selectedCard
                                : ''
                        }`}
                        onClick={() => oncareerSelect(index)}
                    >
                        <Typography variant="h4" fontWeight="bold">
                            {career.title}
                        </Typography>
                        <Typography variant="body2">
                            {career.description}
                        </Typography>
                        <Box
                            className={
                                styles.infinize__jobRecommendationsSalary
                            }
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                <Typography variant="h5">
                                    {career.salary}{' '}
                                    <span>{career.duration}</span>
                                </Typography>
                                <Typography variant="body2">
                                    Match: {career.match}
                                </Typography>
                            </Stack>

                            <SaveStatus
                                isSaved={isSaved(index)}
                                isSaving={isSaving(index)}
                                onSave={() => onSave(index)}
                            />
                        </Box>
                    </Box>
                );
            })}
        </Stack>
    );
}
