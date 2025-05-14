import {Box, Button} from '@mui/material';
import classes from '../../coursePlan.module.css';

export default function ActionButtons({onSave, onCancel}) {
    return (
        <Box className={classes.infinize__coursePlanCardButtons}>
            <Button variant="contained" onClick={onSave}>
                Save
            </Button>
            <Button variant="outlined" onClick={onCancel}>
                Cancel
            </Button>
        </Box>
    );
}
