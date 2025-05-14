'use client';
import {Box, Typography} from '@mui/material';
import styles from '../../career.module.css';
import JobOutlook from './jobOutlook';
import {JOB_OUTLOOK} from '@/config/constants';
import {RecommendationCategory} from '@/components/common';

export default function CategoriesList({jobDetails}) {
    return (
        <Box
            display="grid"
            gridTemplateColumns={{sm: '1fr', md: '1fr 1fr'}}
            rowGap={4}
            columnGap={2}
            className={styles.infinize__recommendationsCards}
        >
            {Object.entries(jobDetails).map(([category, content], index) => (
                <Box key={index} className="infinize__recommendationsCard">
                    <Typography variant="h4" color="primary" gutterBottom>
                        {category}
                    </Typography>

                    {category === JOB_OUTLOOK && (
                        <JobOutlook content={content} />
                    )}
                    {category !== JOB_OUTLOOK && (
                        <RecommendationCategory content={content} />
                    )}
                </Box>
            ))}
        </Box>
    );
}
