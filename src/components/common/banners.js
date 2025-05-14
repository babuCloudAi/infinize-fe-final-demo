import {InfinizeIcon} from '@/components/common';
import {
    Box,
    Icon,
    IconButton,
    ListItemIcon,
    Stack,
    Typography,
    Button
} from '@mui/material';
import classes from './common.module.css';

export default function Banners({
    type = 'waring',
    title,
    description,
    onAction,
    isCloseIcon = true,
    isActionButton = false,
    onActionResolve,
    onCourseClick
}) {
    return (
        <Box
            className={classes.infinize__courseplanBanner}
            sx={{
                border:
                    type === 'warning'
                        ? ' 1px solid #f4b0a1'
                        : ' 1px solid #F7D9A4',
                background: type === 'warning' ? '#fff5f3' : '#FFF8EC'
            }}
            onClick={onCourseClick}
        >
            <Box className={classes.infinize__courseplanBannerContainer}>
                <ListItemIcon
                    className={classes.infinize__courseplanBannerIcon}
                    sx={{
                        background:
                            type === 'warning'
                                ? 'linear-gradient(180deg, #e88b76 0%, #ca5048 100%)'
                                : 'linear-gradient(180deg, #FFC46B 0%, #FFA318 100%)'
                    }}
                >
                    <InfinizeIcon
                        icon={
                            type === 'warning'
                                ? 'basil:cross-outline'
                                : 'bitcoin-icons:alert-filled'
                        }
                        style={{color: '#fff'}}
                    />
                </ListItemIcon>

                <Stack spacing={1}>
                    <Typography
                        variant="h5"
                        className={classes.infinize__courseplanBannerHeading}
                    >
                        {title}
                    </Typography>
                    <Typography variant="body2">{description}</Typography>
                </Stack>
            </Box>

            {isCloseIcon && (
                <IconButton
                    className={classes.infinize__courseplanBannerActionIcon}
                    onClick={onAction}
                >
                    <InfinizeIcon
                        icon="basil:cross-outline"
                        style={{color: '#979FA9'}}
                    />
                </IconButton>
            )}
            {isActionButton && (
                <Button
                    className={classes.infinize__courseplanBannerActionButton}
                    onClick={onActionResolve}
                >
                    Resolve
                </Button>
            )}
        </Box>
    );
}
