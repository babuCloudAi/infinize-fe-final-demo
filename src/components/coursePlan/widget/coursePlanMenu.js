'use client';
import {useState} from 'react';
import {Menu, MenuItem, ListItemIcon, IconButton} from '@mui/material';
import {InfinizeIcon} from '../../common';
import CoursePlanDialogs from '../create/recommendations/dialogs';

export default function CoursePlanMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const toggleIsDeleteDialogOpen = () => {
        setIsDeleteDialogOpen(prev => !prev);
    };

    const handleMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        console.log('Edit option clicked');
    };

    const handleDelete = () => {
        handleMenuClose();
        toggleIsDeleteDialogOpen();
    };

    const handlePlanDelete = () => {
        toggleIsDeleteDialogOpen();
    };

    return (
        <>
            <IconButton
                onClick={handleMenuOpen}
                sx={{alignSelf: {ms: 'center', lg: 'flex-end'}}}
            >
                <InfinizeIcon icon="mi:options-vertical" height="20px" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                className="menu"
            >
                <MenuItem onClick={handleEdit} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon icon="mage:edit-fill" />
                    </ListItemIcon>
                    Edit
                </MenuItem>

                <MenuItem onClick={handleDelete} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon icon="fluent:delete-24-filled" />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>

            <CoursePlanDialogs
                isDeleteDialogOpen={isDeleteDialogOpen}
                onDeleteDialogClose={toggleIsDeleteDialogOpen}
                onDelete={handlePlanDelete}
            />
        </>
    );
}
