'use client';
import {useState, useEffect} from 'react';
import {Stack, Typography, IconButton, Box} from '@mui/material';
import CareersList from './careersList';
import CareerDetails from './careerDetails';
import JobData from '@/data/careerRecommendation/careerRecommendations.json';
import styles from '../../career.module.css';
import {theme} from '@/config';
import Image from 'next/image';
import Link from 'next/link';
import {InfinizeTooltip, RationaleDialog} from '@/components/common';

export default function Recommendations({onRestart}) {
    const [careerList, setCareerList] = useState([]);
    const [selectedCareerIndex, setSelectedCareerIndex] = useState(null);
    const [savedCareers, setSavedCareers] = useState([]);
    const [saveInProgressCareers, setSaveInProgressCareers] = useState([]);
    const [isRationaleDialogOpen, setIsRationaleDialogOpen] = useState(false);

    useEffect(() => {
        setCareerList(JobData.recommendations || []);
        if (JobData.recommendations.length > 0) {
            setSelectedCareerIndex(0);
        }
    }, []);

    const toggleIsRationaleDialog = () => {
        setIsRationaleDialogOpen(prev => !prev);
    };

    const handleSaveCareer = index => {
        sessionStorage.setItem('hasCareerRecommendations', 'true');
        setSaveInProgressCareers(prev => [...prev, index]);
        setTimeout(() => {
            setSavedCareers(prev => [...prev, index]);
            setSaveInProgressCareers(prev => prev.filter(i => i !== index));
        }, 2000);
    };

    return (
        <Stack
            className={styles.infinize__careerRecommendationsContainer}
            mt={3}
        >
            <Box
                className={
                    styles.infinize__careerRecommendationsContainerHeading
                }
            >
                <Typography variant="h2" color="primary">
                    Career recommendations
                </Typography>
                <Box
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    gap={2}
                >
                    <Link
                        className={styles.infinize__viewRationale}
                        href=""
                        onClick={e => {
                            e.preventDefault();
                            toggleIsRationaleDialog();
                        }}
                    >
                        View Rationale
                    </Link>
                    <InfinizeTooltip title="Restart">
                        <IconButton
                            onClick={onRestart}
                            sx={{
                                border: `2px solid ${theme.palette.primary.main}`,
                                borderRadius: '8px'
                            }}
                        >
                            <Image
                                src="/img/restart.svg"
                                width={30}
                                height={30}
                                alt="regenarate-icon"
                            />
                        </IconButton>
                    </InfinizeTooltip>
                </Box>
            </Box>

            <Stack
                direction={{md: 'column', lg: 'row'}}
                padding="20px 30px"
                gap={3}
            >
                <CareersList
                    careers={careerList}
                    selectedCareerIndex={selectedCareerIndex}
                    oncareerSelect={setSelectedCareerIndex}
                    isSaved={index => savedCareers.includes(index)}
                    isSaving={index => saveInProgressCareers.includes(index)}
                    onSave={index => handleSaveCareer(index)}
                />

                {selectedCareerIndex !== null &&
                    careerList[selectedCareerIndex] && (
                        <CareerDetails
                            career={careerList[selectedCareerIndex]}
                            isSaved={savedCareers.includes(selectedCareerIndex)}
                            isSaving={saveInProgressCareers.includes(
                                selectedCareerIndex
                            )}
                            onSave={() => handleSaveCareer(selectedCareerIndex)}
                            isEditable={true}
                        />
                    )}
                {isRationaleDialogOpen && (
                    <RationaleDialog
                        isOpen={isRationaleDialogOpen}
                        onClose={toggleIsRationaleDialog}
                        title="AI rationale for generated career recommendations"
                        contentUrl="/careerRecommendations/rationaleContent.md"
                    />
                )}
            </Stack>
        </Stack>
    );
}
