'use client';
import {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import {Box, Skeleton, Button} from '@mui/material';
import {Widget} from '../../common';
import {useParams} from 'next/navigation';
import coursePlansData from '@/data/coursePlan/coursePlan.json';
import CoursePlanTabs from './coursePlanTabs';
import {NoResults, InfinizeConfirmation} from '../../common';
import Link from 'next/link';
import {useRoute} from '@/context/route';

export default function CoursePlans() {
    const {studentId} = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const [hasCoursePlan, setHasCoursePlan] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('hasCoursePlan') === 'true';
        }
        return false;
    });

    const isProfileRoute = pathname === `/student/${studentId}`;
    const showNoPlan = !hasCoursePlan && isProfileRoute;

    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);
    const [coursePlans, setCoursePlans] = useState([]);
    const [isLimitReachedDialogOpen, setIsLimitReachedDialogOpen] =
        useState(false);

    const coursePlanPath = `/student/${studentId}/coursePlan`;

    const toggleIsLimitReachedDialogOpen = () => {
        setIsLimitReachedDialogOpen(prev => !prev);
    };

    useEffect(() => {
        setCoursePlans(coursePlansData.coursePlans);
    }, []);

    const toggleIsLoading = isLoading => {
        setIsLoading(isLoading);
    };

    useEffect(() => {
        setTimeout(() => toggleIsLoading(false), 2000); // TODO remove this logic after API integration.
    }, []);

    const toggleIsExpanded = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <Box>
            <Widget
                expanded={isExpanded}
                onChange={toggleIsExpanded}
                title="Course Plans"
                actions={
                    !isLoading &&
                    !showNoPlan && (
                        <Button
                            component={Link}
                            variant="contained"
                            className="infinize__Button"
                            href={coursePlanPath}
                            onClick={e => {
                                e.stopPropagation();

                                if (coursePlans.length === 3) {
                                    e.preventDefault();
                                    toggleIsLimitReachedDialogOpen();
                                }
                            }}
                        >
                            Create
                        </Button>
                    )
                }
            >
                {/* {isLoading && (
                    <Box padding={2}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={100}
                        />
                    </Box>
                )}

                {!isLoading && !showNoPlan && (
                    <CoursePlanTabs
                        coursePlan={coursePlans}
                        isLoading={isLoading}
                    />
                )}

                {!isLoading && showNoPlan && (
                    <NoResults
                        title="There are no course plans"
                        description="Get started by creating a new plan."
                        buttonLabel="Create Plan"
                        href={coursePlanPath}
                    />
                )} */}

                {isLoading ? (
                    <Box padding={2}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={100}
                        />
                    </Box>
                ) : (
                    <Box>
                        {showNoPlan ? (
                            <NoResults
                                title="There are no course plans"
                                description="Get started by creating a new plan."
                                buttonLabel="Create Plan"
                                href={coursePlanPath}
                            />
                        ) : (
                            <CoursePlanTabs
                                coursePlan={coursePlans}
                                isLoading={isLoading}
                            />
                        )}
                    </Box>
                )}
            </Widget>

            {/* Limit reached dialog displayed when the number of saved course plans are 3. */}
            {isLimitReachedDialogOpen && (
                <InfinizeConfirmation
                    isOpen
                    onClose={toggleIsLimitReachedDialogOpen}
                    primaryButtonLabel="Continue"
                    onConfirm={() => {
                        router.push(coursePlanPath);
                    }}
                    title="Limit Reached"
                    content="You already have 3 course plans saved. To create another, you will have to replace one of the existing plans."
                />
            )}
        </Box>
    );
}
