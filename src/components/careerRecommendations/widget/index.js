'use client';
import {useEffect, useState} from 'react';
import {Box, Stack, Skeleton, Button} from '@mui/material';
import {NoResults, Widget} from '@/components/common';
import JobData from '@/data/careerRecommendation/careerRecommendations.json';
import CareersListView from './careersListView';
import {useParams, useRouter} from 'next/navigation';
import UploadResumeDialog from './uploadResumeDialog';

export default function CareerRecommendations() {
    const router = useRouter();
    const params = useParams(); // returns an object of dynamic params
    const studentId = params?.studentId;
    const [expanded, setExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // TODO change the default value to 'false' when integrating with API.
    const [careerRecommendations, setCareerRecommendations] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    const handleResumeUpload = file => {
        setResumeFile(file);
    };

    const handleContinue = () => {
        setIsLoading(true); // Show a loading indicator immediately
        // Add a slight delay before navigation to simulate processing
        setTimeout(() => {
            // Navigate to the career recommendations page and pass a query param indicating file was uploaded
            router.push(
                `/student/${studentId}/careerRecommendations?isResumeUploaded =true`
            );
        }, 2000);
    };

    // Triggered when the user clicks "Cancel"
    const handleCancle = () => {
        // Navigate to the same destination but indicate the file was *not* uploaded
        router.push(
            `/student/${studentId}/careerRecommendations?isResumeUploaded =false`
        );
    };

    useEffect(() => {
        setCareerRecommendations(JobData.recommendations); // TODO: Replace with API data once the APIs are available.
    }, []);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 2000); // TODO remove this logic after API integration.
        window.scrollTo(0, 0); // Scrolling to the top of the page when navigating back from other pages.
    }, []);

    const handleAccordionChange = () => {
        setExpanded(prev => !prev);
    };

    const handleViewAll = e => {
        e.stopPropagation();
        console.log('View all');
    };
    const handleGenerateCareer = e => {
        e.stopPropagation();
        setIsOpen(true);
        console.log('Add Career');
    };

    return (
        <Box>
            <Widget
                expanded={expanded}
                onChange={handleAccordionChange}
                title="Career Recommendations"
                actions={
                    !isLoading &&
                    (careerRecommendations.length > 3 ? (
                        <Stack direction="row" gap={2}>
                            <Button variant="outlined" onClick={handleViewAll}>
                                View All
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleGenerateCareer}
                            >
                                Generate
                            </Button>
                        </Stack>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleGenerateCareer}
                        >
                            Generate
                        </Button>
                    ))
                }
            >
                <Box padding={2}>
                    {isLoading && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={100}
                        />
                    )}
                    {!isLoading && careerRecommendations.length > 0 && (
                        <CareersListView careers={careerRecommendations} />
                    )}
                    {!isLoading && careerRecommendations.length == 0 && (
                        <NoResults
                            title="There are no career recommendations"
                            description="Get started by exploring career paths that align with your interests and goals"
                            buttonLabel="Generate"
                        />
                    )}
                    <UploadResumeDialog
                        resumeFile={resumeFile}
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onContinue={handleContinue}
                        onSkip={handleCancle}
                        onResumeUpload={handleResumeUpload}
                        isLoading={isLoading}
                    />
                </Box>
            </Widget>
        </Box>
    );
}
