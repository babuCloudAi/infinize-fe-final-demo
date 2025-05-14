import {ListItem, Typography} from '@mui/material';
import {InfinizeIcon} from './infinizeIcon';

export function RecommendationItem({content}) {
    return (
        <ListItem>
            <InfinizeIcon
                icon="mdi-tick"
                width="20px"
                className="menuItemIcon"
            />
            <Typography variant="body2">{content}</Typography>
        </ListItem>
    );
}
