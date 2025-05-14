import React from 'react';
import {LocalizationProvider} from '@mui/x-date-pickers-pro/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateRangePicker} from '@mui/x-date-pickers-pro/DateRangePicker';
import {SingleInputDateRangeField} from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import {Box, IconButton, InputAdornment} from '@mui/material';
import dayjs from 'dayjs';
import {InfinizeIcon} from '../infinizeIcon';

export function CustomDateRangePicker({name, value, onChange}) {
    // Ensure value is always in dayjs format (or null)
    const formatValue = value => {
        if (value) {
            return [
                value[0] ? dayjs(value[0]) : null,
                value[1] ? dayjs(value[1]) : null
            ];
        }
        return [null, null];
    };

    const handleChange = newValue => {
        // Ensure the formatted value is passed as dayjs objects
        const formattedValue = [
            newValue[0] ? newValue[0].format('YYYY-MM-DD') : null,
            newValue[1] ? newValue[1].format('YYYY-MM-DD') : null
        ];
        onChange(name, formattedValue);
    };

    const handleClear = event => {
        event.stopPropagation();
        onChange(name, [null, null]);
    };

    const hasValue = value && value[0] && value[1];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="date-range-picker-wrapper">
                <DateRangePicker
                    value={formatValue(value)} // Ensure value is formatted as dayjs objects
                    onChange={handleChange}
                    components={{Field: SingleInputDateRangeField}}
                    componentsProps={{
                        textField: {
                            fullWidth: true,
                            InputProps: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {hasValue ? (
                                            <IconButton
                                                size="small"
                                                onClick={handleClear}
                                                edge="end"
                                            >
                                                <InfinizeIcon
                                                    icon="ic:round-clear"
                                                    width={20}
                                                    height={20}
                                                />
                                            </IconButton>
                                        ) : (
                                            <InfinizeIcon
                                                icon="qlementine-icons:calendar-16"
                                                width={20}
                                                height={20}
                                            />
                                        )}
                                    </InputAdornment>
                                )
                            }
                        }
                    }}
                />
            </Box>
        </LocalizationProvider>
    );
}
