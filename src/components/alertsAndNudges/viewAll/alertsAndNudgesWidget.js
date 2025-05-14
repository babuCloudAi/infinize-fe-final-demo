'use client';
import React, {useState} from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Box,
    useTheme,
    Stack,
    Checkbox
} from '@mui/material';
import {InfinizeIcon} from '@/components/common';
import classes from './viewAllAlerts.module.css';
import NudgeDialog from '../widget/nudgeDialog';
import KudosDialog from '../widget/kudosDialog';
import AlertMenu from '../widget/menu';
import {ALERT, DATE_FORMAT, TIMEZONE, ALERT_STATUS} from '@/config/constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import RevertDialog from '../widget/revertDialog';

dayjs.extend(utc);
dayjs.extend(timezone);

const AlertsAndNudgesWidget = ({alert, checked, onChange, hasUnreadItems}) => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    const [isNudgeDialogOpen, setIsNudgeDialogOpen] = useState(false);
    const [isKudosDialogOpen, setIsKudosDialogOpen] = useState(false);
    const [isRevertDialogOpen, setIsRevertDialogOpen] = useState(false);

    const toggleIsNudgeDialogOpen = () => {
        setIsNudgeDialogOpen(prev => !prev);
    };

    const toggleIsKudosDialogOpen = () => {
        setIsKudosDialogOpen(prev => !prev);
    };

    const toggleIsRevertDialogOpen = () => {
        setIsRevertDialogOpen(prev => !prev);
    };
    const handleExpandToggle = () => {
        setExpanded(prev => !prev);
    };

    const handleNudgeSubmit = () => {
        toggleIsNudgeDialogOpen();
    };

    const handleKudosSubmit = () => {
        toggleIsKudosDialogOpen();
    };

    const handleRevertSubmit = e => {
        e.stopPropagation();
        toggleIsRevertDialogOpen();
    };
    return (
        <Accordion
            expanded={expanded}
            onChange={handleExpandToggle}
            disableGutters
            className={classes.infinize__nudgeAccordian}
        >
            <AccordionSummary
                component="div"
                expandIcon={<InfinizeIcon icon={'si:expand-more-duotone'} />}
                sx={{
                    borderBottom: expanded && '1px solid #ebf2fd'
                }}
            >
                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    justifyContent="space-between"
                    alignItems={{xs: 'flex-start', sm: 'center'}}
                    width="100%"
                    spacing={2}
                >
                    <Stack direction="row" spacing={2} alignItems="start">
                        {hasUnreadItems && (
                            <Checkbox
                                color="primary"
                                checked={checked || false}
                                onClick={e => e.stopPropagation()}
                                onChange={onChange}
                            />
                        )}

                        <InfinizeIcon
                            icon={
                                alert?.type === ALERT
                                    ? 'fluent:alert-on-24-filled'
                                    : 'stash:trophy-solid'
                            }
                            style={{color: theme.palette.primary.main}}
                            className={classes.infinize__nudgeIcon}
                        />
                        <Stack spacing={0.5}>
                            <Typography
                                fontWeight={!alert?.status ? 600 : 400}
                                className={classes.infinize__nudgeTitle}
                            >
                                {alert.title}
                            </Typography>
                            <Typography variant="body2">
                                {dayjs(alert.date)
                                    .tz(TIMEZONE)
                                    .format(DATE_FORMAT.SHORT)}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Box
                        display="flex"
                        flexDirection={{xs: 'column', sm: 'row'}}
                        justifyContent="space-between"
                        alignItems={{xs: 'flex-start', sm: 'center'}}
                        gap={1}
                    >
                        {alert.actionPerformedOn && (
                            <Typography variant="body2">
                                {alert.status === ALERT_STATUS.KUDOS
                                    ? `Kudos sent on: `
                                    : alert.status === ALERT_STATUS.ACKNOWLEDGED
                                    ? `Acknowledged on: `
                                    : alert.status === ALERT_STATUS.DISMISSED
                                    ? `Dismissed on: `
                                    : alert.status === ALERT_STATUS.NUDGED
                                    ? `Nudged on: `
                                    : ''}

                                {dayjs(alert.actionPerformedOn)
                                    .tz(TIMEZONE)
                                    .format(DATE_FORMAT.LONG)}
                            </Typography>
                        )}
                        {!alert.actionPerformedOn && !checked && (
                            <AlertMenu
                                onGenerateNudge={toggleIsNudgeDialogOpen}
                                onSendKudos={toggleIsKudosDialogOpen}
                                alertType={alert.type}
                                customClassName="alertsMenu"
                            />
                        )}
                        {alert.status === ALERT_STATUS.DISMISSED && (
                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    alignSelf: 'flex-end',
                                    padding: '8px 16px'
                                }}
                                onClick={handleRevertSubmit}
                            >
                                <InfinizeIcon
                                    icon="hugeicons:return-request"
                                    width="18px"
                                    style={{marginRight: '8px'}}
                                />
                                Revert
                            </Button>
                        )}
                    </Box>
                </Stack>
            </AccordionSummary>

            <AccordionDetails sx={{p: 3}}>
                <Typography variant="body1">{alert.description}</Typography>
            </AccordionDetails>

            {isNudgeDialogOpen && (
                <NudgeDialog
                    isOpen={isNudgeDialogOpen}
                    onClose={toggleIsNudgeDialogOpen}
                    onSend={handleNudgeSubmit}
                />
            )}
            {isKudosDialogOpen && (
                <KudosDialog
                    isOpen={isKudosDialogOpen}
                    onClose={toggleIsKudosDialogOpen}
                    onSend={handleKudosSubmit}
                />
            )}

            {isRevertDialogOpen && (
                <RevertDialog
                    isOpen={isRevertDialogOpen}
                    onClose={toggleIsRevertDialogOpen}
                    onSend={handleRevertSubmit}
                />
            )}
        </Accordion>
    );
};

export default AlertsAndNudgesWidget;
