'use client';
import {useEffect, useState} from 'react';
import {Box, Skeleton, Typography} from '@mui/material';
import {InfinizeDialog} from './infinizeDialog';
import {MarkdownViewer} from './markdownViewer';
import classes from './common.module.css';

export function RationaleDialog({
    isOpen,
    onClose,
    contentUrl,
    title,
    isOriginalAiRecommendation
}) {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            try {
                const res = await fetch(contentUrl);
                const text = await res.text();
                setTimeout(() => {
                    setContent(text); // TODO: Remove this after API integration
                    setIsLoading(false);
                }, 3000);
            } catch (error) {
                console.error('Error loading Rationale Content:', error);
                setIsLoading(false);
            }
        }

        setIsLoading(true);
        fetchContent();
    }, [contentUrl]);

    return (
        <InfinizeDialog
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="md"
            title={title}
        >
            <Box className={classes.infinize__rationaleViewerContainer}>
                <Box className={classes.infinize__rationaleViewerSubContainer}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {isLoading &&
                            Array(2)
                                .fill(0)
                                .map((_, index) => (
                                    <Skeleton
                                        key={`skeleton_${index}`}
                                        variant="rectangular"
                                        height={180}
                                    />
                                ))}
                    </Box>

                    {!isLoading && <MarkdownViewer markdownContent={content} />}
                </Box>
                {!isLoading && isOriginalAiRecommendation && (
                    <Box p={2}>
                        <Typography variant="h6">Disclimer</Typography>
                        <Typography variant="body">
                            This AI-generated rationale reflects the original
                            course plan generated based on current student
                            preferences and academic data. If you’ve made any
                            manual changes or customizations to the plan, the
                            rationale shown here may no longer fully align with
                            the modified version.
                        </Typography>
                    </Box>
                )}
            </Box>
        </InfinizeDialog>
    );
}
