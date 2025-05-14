'use client';
import {useState, useEffect} from 'react';
import {Grid, Button, Skeleton, Stack, Chip} from '@mui/material';
import {CustomChip, Widget} from '@/components/common';
import nudgeData from '@/data/alertsAndNudges/nudge.json';
import styles from './alertsAndNudges.module.css';
import AlertsAndNudgesCard from './alertsAndNudgesCard';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {ALERT_STATUS} from '@/config/constants';

export default function AlertsAndNudges() {
    const {studentId} = useParams();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const filtered = nudgeData.studentNudges.filter(alert => !alert.status);

        setAlerts(filtered);

        setTimeout(() => setIsLoading(false), 2000); // TODO remove this logic after API integration.
    }, []);

    const handleAccordionChange = () => {
        setIsExpanded(prev => !prev);
    };
    return (
        <Widget
            expanded={isExpanded}
            onChange={handleAccordionChange}
            title="Alerts & Nudges"
            unReadChip={
                <Chip
                    label={`${
                        alerts?.filter(alert => !alert.status).length
                    } Unread`}
                    size="small"
                    className={styles.infinize__nudgesChip}
                />
            }
            actions={
                alerts.length > 3 && (
                    <Button
                        variant="outlined"
                        onClick={e => e.stopPropagation()}
                        component={Link}
                        sx={{textTransform: 'none'}}
                        href={`/student/${studentId}/alerts`}
                    >
                        View All
                    </Button>
                )
            }
        >
            {isLoading && (
                <Stack direction="row" gap={2} p={2}>
                    {Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton key={index} width="33%" height={200} />
                        ))}
                </Stack>
            )}
            {!isLoading && (
                <Grid
                    container
                    className={styles.infinize__nudgesCards}
                    spacing={3}
                >
                    {alerts.slice(0, 3).map((alert, index) => (
                        <Grid
                            key={alert.id || `nudge-${index}`}
                            size={{xs: 12, sm: 6, md: 4}}
                        >
                            <AlertsAndNudgesCard alert={alert} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Widget>
    );
}
