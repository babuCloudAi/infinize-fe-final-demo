'use client';
import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Chip,
    Checkbox,
    Button,
    IconButton,
    Skeleton
} from '@mui/material';
import classes from './viewAllAlerts.module.css';
import Filter from './filter';
import {
    CustomChip,
    InfinizeIcon,
    InfinizePagination,
    Loader,
    NoResults
} from '@/components/common';
import {
    ALERT_STATUS,
    ALERT_FILTER_LABELS,
    ALERT_NO_RESULT_MESSAGES
} from '@/config/constants';
import AlertsAndNudgesWidget from './alertsAndNudgesWidget';
import AlertMenu from '../widget/menu';

export default function Alerts({alerts = []}) {
    const [alertsWithIds, setAlertsWithIds] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(ALERT_STATUS.UNREAD);
    const [selectedAlerts, setSelectedAlerts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    console.log(selectedFilter);

    function assignAlertIds(alerts) {
        return alerts.map((alert, index) => ({
            ...alert,
            id: `${index}`
        }));
    }

    useEffect(() => {
        const alertsWithIds = assignAlertIds(alerts);
        setAlertsWithIds(alertsWithIds);

        const filtered = alertsWithIds.filter(alert => {
            if (!selectedFilter) return true;
            if (selectedFilter === ALERT_STATUS.UNREAD) {
                return !alert.status || alert.status === ALERT_STATUS.UNREAD;
            }
            return alert.status === selectedFilter;
        });

        setFilteredAlerts(filtered);
        setCurrentPage(1);
        setSelectedAlerts([]);
    }, [selectedFilter, alerts]);

    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
        setSelectedAlerts([]); // Clear selection on page change
    };

    const handleBulkAction = () => {
        const selectedAlertObjects = alertsWithIds.filter(alert =>
            selectedAlerts.includes(alert.id)
        );
        console.log('Performing bulk action for:', selectedAlertObjects);
        // TODO: Send selectedAlertObjects to your API
    };

    const handleSelectAllChange = () => {
        const allIdsOnPage = paginatedAlerts.map(alert => alert.id);
        const allSelected = allIdsOnPage.every(id =>
            selectedAlerts.includes(id)
        );

        setSelectedAlerts(
            allSelected
                ? selectedAlerts.filter(id => !allIdsOnPage.includes(id)) // Deselect all
                : [...new Set([...selectedAlerts, ...allIdsOnPage])] // Select all
        );
    };

    const handleCheckboxChange = alertId => {
        setSelectedAlerts(prev =>
            prev.includes(alertId)
                ? prev.filter(id => id !== alertId)
                : [...prev, alertId]
        );
    };
    const toggleIsLoading = isLoading => {
        setIsLoading(isLoading);
    };
    useEffect(() => {
        setTimeout(() => {
            toggleIsLoading(false);
        }, 2000); // TODO: Replace logic once the API is added
    }, []);
    return (
        <Box mt={3}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                px={2}
                py={1}
            >
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography
                        className={classes.infinize__viewAllAlertsTabHeading}
                    >
                        Alerts {!selectedFilter && '(All)'}
                    </Typography>
                    {!isLoading &&
                        (!selectedFilter ||
                            selectedFilter === ALERT_STATUS.UNREAD) && (
                            <Chip
                                label={`${
                                    alerts?.filter(alert => !alert.status)
                                        .length
                                } Unread`}
                                size="small"
                                className={classes.infinize__alertChip}
                            />
                        )}
                    {!isLoading && selectedFilter && (
                        <CustomChip
                            label={ALERT_FILTER_LABELS[selectedFilter]}
                            size="small"
                            onDelete={() => setSelectedFilter(null)}
                        />
                    )}
                </Box>

                {!isLoading && (
                    <Box display="flex" alignItems="center" gap={1.5}>
                        {selectedAlerts.length > 0 && (
                            <AlertMenu
                                name={'Bulk Actions'}
                                onGenerateNudge={handleBulkAction}
                                onSendKudos={handleBulkAction}
                                alertType={'alert'}
                                onDismiss={handleBulkAction}
                            />
                        )}
                        <Filter
                            alertsList={alerts}
                            onFilteredAlerts={setFilteredAlerts}
                            onActiveFilter={setSelectedFilter}
                            selectedFilter={selectedFilter}
                            isAlerts={true}
                        />
                    </Box>
                )}
            </Box>
            {filteredAlerts.length === 0 && (
                <NoResults
                    title={
                        ALERT_NO_RESULT_MESSAGES[selectedFilter]?.title ||
                        'No Alerts Yet'
                    }
                    description={
                        ALERT_NO_RESULT_MESSAGES[selectedFilter]?.description ||
                        'There are no alerts at the moment. '
                    }
                />
            )}
            {filteredAlerts.length > 0 && (
                <Box display="flex" flexDirection="column" gap={3} mt={2}>
                    {!isLoading && selectedFilter === ALERT_STATUS.UNREAD && (
                        <Box display="flex" alignItems="center" px={2}>
                            <Checkbox
                                checked={paginatedAlerts.every(alert =>
                                    selectedAlerts.includes(alert.id)
                                )}
                                onChange={handleSelectAllChange}
                            />
                            <Typography>Select All</Typography>
                        </Box>
                    )}

                    <Box display="flex" flexDirection="column" gap={2}>
                        {isLoading &&
                            Array(4)
                                .fill(0)
                                .map((_, index) => (
                                    <Skeleton
                                        key={`skeleton_${index}`}
                                        variant="rectangular"
                                        height={100}
                                    />
                                ))}
                    </Box>

                    {paginatedAlerts.map(alert => (
                        <Box
                            key={alert.id}
                            display="flex"
                            alignItems="flex-start"
                            width="100%"
                        >
                            {!isLoading && (
                                <AlertsAndNudgesWidget
                                    hasUnreadItems={
                                        selectedFilter === ALERT_STATUS.UNREAD
                                    }
                                    alert={alert}
                                    checked={selectedAlerts.includes(alert.id)}
                                    onChange={e => {
                                        e.stopPropagation();
                                        handleCheckboxChange(alert.id);
                                    }}
                                />
                            )}
                        </Box>
                    ))}

                    {!isLoading && (
                        <Box
                            display={'flex'}
                            justifyContent={
                                selectedAlerts.length > 0
                                    ? 'space-between'
                                    : 'flex-end'
                            }
                        >
                            {selectedAlerts.length > 0 && (
                                <Box display="flex" alignItems="center">
                                    <IconButton
                                        onClick={() => setSelectedAlerts([])}
                                    >
                                        <InfinizeIcon
                                            icon="solar:close-square-outline"
                                            width={20}
                                            height={20}
                                            style={{display: 'flex'}}
                                        />
                                    </IconButton>
                                    <Typography variant="body2">
                                        {selectedAlerts.length} Item
                                        {selectedAlerts.length > 1 ? 's' : ''}
                                        {/* sapce between itens and select  */}
                                        {''} Selected
                                    </Typography>
                                </Box>
                            )}
                            <Box display={'flex'} gap={1} alignItems={'center'}>
                                <Typography variant="body2">
                                    Showing 1 to 6 of {filteredAlerts.length}{' '}
                                    items
                                </Typography>
                                <InfinizePagination
                                    count={Math.ceil(
                                        filteredAlerts.length / itemsPerPage
                                    )}
                                    page={currentPage}
                                    onPageChange={handlePageChange}
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}
