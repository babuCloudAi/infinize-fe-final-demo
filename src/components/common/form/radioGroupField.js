'use client';
import React from 'react';
import {
    Radio,
    FormControlLabel,
    Box,
    FormControl,
    FormLabel,
    RadioGroup
} from '@mui/material';

export function RadioGroupField({name, label, options, value, onChange}) {
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend" sx={{display: 'none'}}>
                {label}
            </FormLabel>
            <RadioGroup
                row
                name={name}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
            >
                <Box display="flex" gap={2} flexWrap="wrap">
                    {options.map((option, index) => (
                        <FormControlLabel
                            key={option}
                            control={
                                <Radio
                                    id={`${name}-radio-${index}`}
                                    value={option}
                                />
                            }
                            label={option}
                        />
                    ))}
                </Box>
            </RadioGroup>
        </FormControl>
    );
}
