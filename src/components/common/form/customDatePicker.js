'use client';
import React, {useState} from 'react';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {IconButton, InputAdornment, TextField} from '@mui/material';
import {InfinizeIcon} from '../index';

export function CustomDatePicker({name, label, value, onChange}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClear = event => {
        event.stopPropagation();
        onChange('');
    };

    const handleCalendarClick = event => {
        event.stopPropagation();
        setIsOpen(true);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                name={name}
                value={value ? dayjs(value) : null}
                onChange={newValue =>
                    onChange(newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                enableAccessibleFieldDOMStructure={false}
                slots={{
                    textField: params => (
                        <TextField
                            {...params}
                            fullWidth
                            onClick={() => setIsOpen(true)}
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {value ? (
                                                <IconButton
                                                    size="small"
                                                    onClick={handleClear}
                                                    edge="end"
                                                >
                                                    <InfinizeIcon
                                                        icon="ic:round-clear"
                                                        width={20}
                                                        hight={20}
                                                    />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    size="small"
                                                    onClick={
                                                        handleCalendarClick
                                                    }
                                                    edge="end"
                                                >
                                                    <InfinizeIcon
                                                        icon="qlementine-icons:calendar-16"
                                                        width={20}
                                                        hight={20}
                                                    />
                                                </IconButton>
                                            )}
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    )
                }}
            />
        </LocalizationProvider>
    );
}
