'use client';
import {Box, colors, IconButton, Typography} from '@mui/material';
import {useState, useEffect} from 'react';
import dismissMessageData from '@/data/alertsAndNudges/dismissMessage.json';
import {InfinizeIcon, InfinizeDialog, AILoader} from '@/components/common';
import classes from './alertsAndNudges.module.css';

export default function RevertDialog({isOpen, onClose, onSend}) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            toggleIsLoading(true);
            setTimeout(() => {
                toggleIsLoading(false);
            }, 2000); // TODO: Replace logic once the API is added
        }
    }, [isOpen]);

    const toggleIsLoading = isLoading => {
        setIsLoading(isLoading);
    };

    return (
        <InfinizeDialog
            isOpen={isOpen}
            onClose={onClose}
            actionsLayoutAlignment={'center'}
            primaryButtonLabel={!isLoading && 'Revert'}
            onPrimaryButtonClick={onSend}
            contentItemsAlignment={isLoading ? 'center' : 'flex-start'}
        >
            {isLoading && <AILoader />}
            {!isLoading && (
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    flexDirection={'column'}
                    width={'100%'}
                    textAlign={'center'}
                    gap={2}
                >
                    <Box className={classes.infinize__dialoglIcon}>
                        <InfinizeIcon
                            icon="jam:alert"
                            style={{color: '#1C71B5', margin: 'auto'}}
                        />
                    </Box>
                    <Typography className={classes.infinize__dialogTitle}>
                        Confirm Revert
                    </Typography>
                    <Typography>{dismissMessageData.message}</Typography>
                </Box>
            )}
        </InfinizeDialog>
    );
}
