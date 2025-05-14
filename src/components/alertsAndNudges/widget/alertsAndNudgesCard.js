'use client';
import {useState, useRef, useEffect} from 'react';
import {
    Box,
    Stack,
    Typography,
    Tooltip,
    useTheme,
    Link,
    Button
} from '@mui/material';
import {InfinizeDialog, InfinizeIcon} from '@/components/common';
import classes from '../../common/common.module.css';
import NudgeDialog from './nudgeDialog';
import KudosDialog from './kudosDialog';
import AlertMenu from './menu';
import {ALERT, DATE_FORMAT, TIMEZONE, ALERT_STATUS} from '@/config/constants';
import alertClasses from './alertsAndNudges.module.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

//  Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export default function AlertsAndNudgesCard({alert}) {
    const theme = useTheme();
    const [isNudgeDialogOpen, setIsNudgeDialogOpen] = useState(false);
    const [isKudosDialogOpen, setIsKudosDialogOpen] = useState(false);
    const [isAlertDetailsDialogOpen, setIsAlertDetailsDialogOpen] =
        useState(false);
    const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false); // <-- for "Read more"
    const descriptionRef = useRef(null); // <-- ref for description

    const toggleIsDialogOpen = () => {
        setIsAlertDetailsDialogOpen(prev => !prev);
    };
    const toggleIsNudgeDialogOpen = () => {
        setIsNudgeDialogOpen(prev => !prev);
    };

    const toggleIsKudosDialogOpen = () => {
        setIsKudosDialogOpen(prev => !prev);
    };

    const handleNudgeSubmit = () => {
        toggleIsNudgeDialogOpen();
    };

    const handleKudosSubmit = () => {
        toggleIsKudosDialogOpen();
    };

    // Check if description is actually truncated
    useEffect(() => {
        if (descriptionRef.current) {
            const {scrollHeight, clientHeight} = descriptionRef.current;
            setIsDescriptionTruncated(scrollHeight > clientHeight);
        }
    }, [alert.description]);
    return (
        <Box
            className={classes.infinize__widgetCard}
            minWidth={300}
            width={'100%'}
            overflow={'auto'}
        >
            <Box className={classes.infinize__widgetCardContent}>
                <Box className={classes.infinize__widgetCardEyeIcon}>
                    <InfinizeIcon icon="mingcute:eye-line" />
                    {!alert.actionPerformedOn && (
                        <Box
                            className={classes.infinize__widgetCardEyeIconDot}
                            sx={{backgroundColor: theme.palette.primary.main}}
                        />
                    )}
                </Box>
                <Stack direction="row" spacing={2} alignItems="start" pt={2}>
                    <InfinizeIcon
                        icon={
                            alert.type === ALERT
                                ? 'fluent:alert-on-24-filled'
                                : 'stash:trophy-solid'
                        }
                        style={{color: theme.palette.primary.main}}
                        className={classes.infinize__nudgeIcon}
                    />

                    <Stack spacing={1}>
                        <Tooltip title={alert.title}>
                            <Typography variant="h4">{alert.title}</Typography>
                        </Tooltip>
                        <Typography variant="body2">
                            {dayjs(alert.date)
                                .tz(TIMEZONE)
                                .format(DATE_FORMAT.SHORT)}
                        </Typography>
                    </Stack>
                </Stack>
                <Box mt={2}>
                    <Typography
                        variant="body1"
                        className={alertClasses.infinize__alertDescription}
                        ref={descriptionRef} // <-- Attach ref here
                    >
                        {alert.description}
                    </Typography>

                    {/* Show "Read More" only if text is truncated */}
                    {isDescriptionTruncated && (
                        <Link
                            component="button"
                            variant="body2"
                            onClick={toggleIsDialogOpen}
                        >
                            Read more
                        </Link>
                    )}

                    <InfinizeDialog
                        isOpen={isAlertDetailsDialogOpen}
                        onClose={toggleIsDialogOpen}
                        isClosable={true}
                        heading={alert.title}
                        children={
                            <Typography variant="body1">
                                {alert.description}
                            </Typography>
                        }
                        maxWidth="md"
                    />
                </Box>
            </Box>
            <Box
                display={!alert.actionPerformedOn ? 'contents' : 'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                width={'100%'}
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

                {!alert.actionPerformedOn && (
                    <AlertMenu
                        onGenerateNudge={toggleIsNudgeDialogOpen}
                        onSendKudos={toggleIsKudosDialogOpen}
                        alertType={alert.type}
                    />
                )}
                {alert.status == 'dismissed' && (
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            alignSelf: 'flex-end'
                        }}
                    >
                        <InfinizeIcon
                            icon="hugeicons:return-request"
                            width="18px"
                        />
                        Return
                    </Button>
                )}

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
            </Box>
        </Box>
    );
}
