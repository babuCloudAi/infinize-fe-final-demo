import React from 'react';
import {
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel
} from '@mui/material';
import {InfinizeIcon} from '@/components/common';
import {visuallyHidden} from '@mui/utils';

export function SelectField({
    name,
    label,
    options = [],
    value,
    onChange,
    helperText,
    placeholder = 'Select',
    isRequired,
    isDisabled
}) {
    return (
        <FormControl fullWidth required={isRequired}>
            <InputLabel id={`${name}-label`} sx={visuallyHidden}>
                {label}
            </InputLabel>
            <Select
                id={name}
                name={name}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                displayEmpty
                disabled={isDisabled}
                renderValue={selected => {
                    if (!selected) {
                        return placeholder;
                    }
                    const selectedOption = options.find(
                        option => option.value === selected
                    );
                    return selectedOption?.label || selected;
                }}
                sx={{
                    '&.Mui-disabled .MuiSelect-select': {
                        WebkitTextFillColor: '#D8E6EC !important'
                    },
                    '& .MuiSelect-icon': {
                        display: value ? 'none' : 'block'
                    }
                }}
                inputProps={{
                    'aria-labelledby': `${name}-label`,
                    id: name
                }}
                endAdornment={
                    value && (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => onChange('')}
                                edge="end"
                                size="small"
                            >
                                <InfinizeIcon
                                    icon="ic:round-clear"
                                    width={20}
                                    hight={20}
                                />
                            </IconButton>
                        </InputAdornment>
                    )
                }
            >
                {options.length > 0 ? (
                    options.map((option, idx) => (
                        <MenuItem
                            key={`option-${idx}`}
                            value={option?.value || option}
                            disabled={option.disabled || false}
                        >
                            {option?.label || option}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No options available</MenuItem>
                )}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}
