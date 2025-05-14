'use client';
import React, {useState} from 'react';
import {Box, Tabs, Tab, Typography} from '@mui/material';
import classes from './tabs.module.css';
import CurrentEnrollment from './currentEnrollment';

export default function EnrollmentDetails() {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => setActiveTab(newValue);

    return (
        <Box
            sx={{width: '100%'}}
            className={classes.infinize__enrollmentTabsContainer}
        >
            <Tabs
                value={activeTab}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                className={classes.infinize__enrollmentTabsBorder}
            >
                <Tab
                    label="Current Enrollment"
                    className={classes.infinize__enrollmentTabs}
                />
                <Tab
                    label="Enrollment History"
                    className={classes.infinize__enrollmentTabs}
                />
                <Tab
                    label="Course Analytics"
                    className={classes.infinize__enrollmentTabs}
                />
                <Tab
                    label="Interaction Summary"
                    className={classes.infinize__enrollmentTabs}
                />
            </Tabs>

            {activeTab === 0 && <CurrentEnrollment />}
            {activeTab === 1 && (
                <Typography variant="h6" sx={{mt: 2}}></Typography>
            )}
            {activeTab === 2 && (
                <Typography variant="h6" sx={{mt: 2}}></Typography>
            )}
            {activeTab === 3 && (
                <Typography variant="h6" sx={{mt: 2}}></Typography>
            )}
        </Box>
    );
}
