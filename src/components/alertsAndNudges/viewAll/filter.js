'use client';
import {useState} from 'react';
import {Menu, MenuItem, IconButton, Typography} from '@mui/material';
import {InfinizeIcon} from '@/components/common';
import classes from './viewAllAlerts.module.css';
import {ALERT_FILTER_LABELS} from '@/config/constants';

export default function Filter({
    onActiveFilter,
    selectedFilter,
    isAlerts,
    isAccomplishments
}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFilter = statusKey => {
        const updatedFilter = selectedFilter === statusKey ? null : statusKey;
        onActiveFilter(updatedFilter);
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                edge="end"
                size="small"
                className={classes.infinize__alertFilter}
                onClick={handleMenuOpen}
            >
                <InfinizeIcon
                    icon="majesticons:filter-line"
                    width={20}
                    height={20}
                />
                <Typography>Filter</Typography>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                className="filterMenu"
            >
                {Object.entries(ALERT_FILTER_LABELS).map(([status, label]) => {
                    const isHidden =
                        (status === 'nudged' && !isAlerts) ||
                        (status === 'kudosGiven' && !isAccomplishments);
                    if (isHidden) return null;

                    return (
                        <MenuItem
                            key={status}
                            onClick={() => handleFilter(status)}
                            selected={selectedFilter?.includes(status)}
                            className="menuItem"
                        >
                            {label}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
