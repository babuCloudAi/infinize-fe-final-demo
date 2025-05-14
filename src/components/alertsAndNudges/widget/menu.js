'use client';
import {useState} from 'react';
import {Menu, MenuItem, ListItemIcon, Button} from '@mui/material';
import {InfinizeIcon} from '@/components/common';
import {ALERT} from '@/config/constants';

export default function AlertMenu({
    onGenerateNudge,
    onSendKudos,
    onDismiss,
    alertType,
    name,
    customClassName = 'menu'
}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = event => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDismiss = () => {
        setAnchorEl(null);
        onDismiss();
    };

    const handleAcknowledge = () => {
        setAnchorEl(null);
    };

    const handleNudgeSubmit = () => {
        setAnchorEl(null);
        onGenerateNudge();
    };

    const handleKudosSubmit = () => {
        setAnchorEl(null);
        onSendKudos();
    };

    const handleAction = () => {
        if (alertType === ALERT) {
            handleNudgeSubmit();
        } else {
            handleKudosSubmit();
        }
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={handleMenuOpen}
                sx={{
                    textTransform: 'none',
                    alignSelf: 'flex-end',
                    padding: '8px 16px'
                }}
            >
                {name ? name : 'Actions'}
                <InfinizeIcon icon="tabler:chevron-right" width="18px" />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'left'}}
                className={customClassName}
            >
                <MenuItem onClick={handleAction} className={customClassName}>
                    <ListItemIcon>
                        <InfinizeIcon
                            icon={
                                alertType === ALERT
                                    ? 'hugeicons:touchpad-02'
                                    : 'pepicons-pop:hands-clapping'
                            }
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    {alertType === ALERT ? 'Generate Nudge' : 'Send Kudos'}
                </MenuItem>

                <MenuItem onClick={handleDismiss} className={customClassName}>
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="fluent:dismiss-circle-12-regular"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Dismiss
                </MenuItem>

                <MenuItem
                    onClick={handleAcknowledge}
                    className={customClassName}
                >
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="iconamoon:like"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Acknowledge
                </MenuItem>
            </Menu>
        </>
    );
}
