import {
    Box,
    Stack,
    Typography,
    Tooltip,
    useTheme,
    Divider
} from '@mui/material';
import {InfinizeIcon} from '@/components/common';
import classes from '../common/common.module.css';

export default function NotesCard({note}) {
    const theme = useTheme();

    return (
        <Box className={classes.infinize__widgetCard}>
            <Box className={classes.infinize__widgetCardContent}>
                <Stack direction="row" spacing={2} alignItems="start">
                    <InfinizeIcon
                        icon="solar:notes-bold"
                        style={{color: theme.palette.primary.main}}
                        className={classes.infinize__nudgeIcon}
                    />

                    <Stack spacing={1}>
                        <Tooltip title={note.title}>
                            <Typography variant="h4">{note.title}</Typography>
                        </Tooltip>
                        <Typography variant="body2">{note.date}</Typography>
                    </Stack>
                </Stack>

                <div className={classes.infinize__widgetCardNotes}>
                    <Divider />
                </div>

                <Typography variant="h5">
                    Created by: <span>{note.name}</span>
                </Typography>

                <Typography variant="body1">{note.description}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={'4px'}>
                <Typography variant="h5">Attachment: </Typography>
                <Typography variant="h5">
                    {note.attachment || 'None'}
                </Typography>
                {note.attachment && (
                    <InfinizeIcon
                        icon="solar:file-download-outline"
                        width={12}
                    />
                )}
            </Box>
        </Box>
    );
}
