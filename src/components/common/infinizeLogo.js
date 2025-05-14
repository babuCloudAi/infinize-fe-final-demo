import React from 'react';
import {Box} from '@mui/material';
import classes from './common.module.css';
import Image from 'next/image';

export default function InfinizeLogo() {
    return (
        <Box className={classes.infinize__logo}>
            <Image
                src="/img/infinizeLogo.svg"
                alt="Loading..."
                width={150} // Adjust as needed
                height={50} // Adjust as needed
                className={classes.infinize__logoIcon}
            />
        </Box>
    );
}
