'use client';
import React, {useState, useEffect} from 'react';
import {Box, Tabs, Tab} from '@mui/material';
import classes from './viewAllAlerts.module.css';
import Alerts from './alerts';
import Accomplishments from './accomplishments';
import alertsData from '@/data/alertsAndNudges/nudge.json';
import {ALERT_STATUS} from '@/config/constants';

export default function ViewAllAlerts() {
    const [activeTab, setActiveTab] = useState(0);
    const [alerts, setAlerts] = useState([]);
    const [accomplishments, setAccomplishments] = useState([]);

    useEffect(() => {
        const alertTypeFiltered = alertsData.studentNudges.filter(
            alerts => alerts.type === ALERT_STATUS.ALERT
        );
        const successTypeFiltered = alertsData.studentNudges.filter(
            alert => alert.type === ALERT_STATUS.SUCCESS
        );

        setAlerts(alertTypeFiltered); // Set filtered alerts with type "alert"
        setAccomplishments(successTypeFiltered); // Set filtered alerts with type "success"
    }, []);

    const handleChange = (event, newValue) => setActiveTab(newValue);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Box
            sx={{width: '100%'}}
            className={classes.infinize__viewAllAlertsContainer}
        >
            <Tabs
                value={activeTab}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                className={classes.infinize__viewAllAlertsTabsBorder}
            >
                <Tab
                    label="Alerts"
                    className={classes.infinize__viewAllAlertsTab}
                />
                <Tab
                    label="Accomplishments"
                    className={classes.infinize__viewAllAlertsTab}
                />
            </Tabs>

            {activeTab === 0 && <Alerts alerts={alerts} />}
            {activeTab === 1 && (
                <Accomplishments accomplishments={accomplishments} />
            )}
        </Box>
    );
}
