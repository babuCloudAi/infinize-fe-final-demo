'use client';
import {useState, useEffect} from 'react';
import {Tabs, Tab, Box, Typography, Stack, Link} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import classes from '../coursePlan.module.css';
import {InfinizeDialog, InfinizeIcon, RationaleDialog} from '../../common';
import TermCard from './termCard';
import AdditionalRecommendations from '../create/recommendations/additionalRecommendations';
import RecommendationsData from '@/data/coursePlan/recommendations.json';
import CoursePlanMenu from './coursePlanMenu';

function TabPanel({children, value, index}) {
    return <div>{value === index && <Box>{children}</Box>}</div>;
}

export default function CoursePlanTabs({coursePlan}) {
    const theme = useTheme();
    const [selectedTab, setSelectedTab] = useState(0);
    const [isRecommendationsDialogOpen, setIsRecommendationsDialogOpen] =
        useState(false);
    const [isRationaleDialogOpen, setIsRationaleDialogOpen] = useState(false);
    const [isRecommendationsLoading, setIsRecommendationsLoading] =
        useState(true);
    const [recommendations, setRecommendations] = useState([]);

    const toggleIsRationaleDialogOpen = () => {
        setIsRationaleDialogOpen(prev => !prev);
    };

    const toggleIsRecommendationsDialogOpen = () => {
        setIsRecommendationsDialogOpen(prev => !prev);
    };

    const handleTabSelectionChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleRecommendationsOpen = async () => {
        toggleIsRecommendationsDialogOpen();
        setIsRecommendationsLoading(true);
        setTimeout(() => {
            setRecommendations(RecommendationsData.recommendations);
            setIsRecommendationsLoading(false);
        }, 2000); // TODO remove this logic after API integration.
    };

    return (
        <Box className={classes.infinize__coursePlanPage}>
            <Tabs
                value={selectedTab}
                onChange={handleTabSelectionChange}
                variant="scrollable"
                scrollButtons="auto"
                className={classes.infinize__coursePlanPageTabs}
                sx={{
                    '.MuiTabs-flexContainer': {
                        gap: '20px',
                        borderBottom: '2px solid #ededed'
                    }
                }}
            >
                {coursePlan.map((plan, index) => (
                    <Tab
                        key={`coursePlan__tab_${index}`}
                        label={plan.name}
                        icon={
                            <Box
                                className="infinize__IconOuter"
                                sx={{
                                    border: '3px solid #daeefe',
                                    width: '25px',
                                    height: '25px'
                                }}
                            >
                                <InfinizeIcon
                                    icon="fluent:hat-graduation-sparkle-24-filled"
                                    style={{color: theme.palette.primary.main}}
                                    width="15px"
                                />
                            </Box>
                        }
                        iconPosition="start"
                        sx={{color: theme.palette.primary.main}}
                        className={classes.infinize__coursePlanPageTab}
                    />
                ))}
            </Tabs>
            {coursePlan.map((plan, index) => (
                <TabPanel
                    key={`coursePlan__tabPanel_${index}`}
                    value={selectedTab}
                    index={index}
                >
                    <Box className={classes.infinize__coursePlanTermsContainer}>
                        <Box
                            className={classes.infinize__coursePlanTermCredits}
                            sx={{
                                flexDirection: {
                                    md: 'row',
                                    sm: 'column',
                                    xs: 'column'
                                },
                                alignItems: {
                                    md: 'center',
                                    xs: 'flex-start'
                                }
                            }}
                        >
                            <Typography>
                                Total Credits: {plan.totalCredits}
                            </Typography>
                            <Stack
                                width={{sm: '100%', md: 'auto'}}
                                direction={'row'}
                                alignItems={{
                                    lg: 'center',
                                    md: 'flex-start'
                                }}
                                justifyContent={'space-between'}
                            >
                                <Stack
                                    direction={{md: 'column', lg: 'row'}}
                                    alignItems={{
                                        lg: 'center',
                                        md: 'flex-start'
                                    }}
                                    spacing={2}
                                >
                                    <Link
                                        href=""
                                        style={{
                                            color: theme.palette.primary.main
                                        }}
                                        onClick={e => {
                                            e.preventDefault();
                                            toggleIsRationaleDialogOpen();
                                        }}
                                    >
                                        View Rationale
                                    </Link>

                                    <Link
                                        href="#"
                                        style={{
                                            color: theme.palette.primary.main
                                        }}
                                        onClick={e => {
                                            e.preventDefault();
                                            handleRecommendationsOpen();
                                        }}
                                    >
                                        Additional Recommendations
                                    </Link>
                                </Stack>

                                <CoursePlanMenu />
                            </Stack>
                        </Box>
                        <Box
                            className={classes.infinize__coursePlanLandingCards}
                        >
                            {plan.terms.map((term, idx) => (
                                <TermCard key={idx} term={term} />
                            ))}
                        </Box>
                    </Box>
                </TabPanel>
            ))}

            {isRationaleDialogOpen && (
                <RationaleDialog
                    isOpen
                    onClose={toggleIsRationaleDialogOpen}
                    title="AI rationale for generated course plan"
                    contentUrl="/coursePlan/rationaleContent.md"
                />
            )}
            {isRecommendationsDialogOpen && (
                <InfinizeDialog
                    isOpen
                    onClose={toggleIsRecommendationsDialogOpen}
                    maxWidth="md"
                >
                    <AdditionalRecommendations
                        customStyles={{width: '100%', height: '70vh'}}
                        isEditMode={false}
                        recommendations={recommendations}
                        isLoading={isRecommendationsLoading}
                    />
                </InfinizeDialog>
            )}
        </Box>
    );
}
