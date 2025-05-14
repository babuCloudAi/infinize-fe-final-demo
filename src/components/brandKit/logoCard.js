import {Card, CardContent, Typography} from '@mui/material';
import classes from './brandKit.module.css';
import FileInput from '../common/form/fileInput';
import {LOGO_ACCEPTED_FORMATS} from '@/config/constants';
LOGO_ACCEPTED_FORMATS;

export default function LogoCard({logo, onLogoChange}) {
    return (
        <Card className={classes.infinize__brandKitCard}>
            <CardContent>
                <Typography variant="h6" color="primary.main" mb={2}>
                    Logo
                </Typography>
                <FileInput
                    file={logo}
                    setFile={onLogoChange}
                    acceptedFormats={Object.keys(LOGO_ACCEPTED_FORMATS)}
                />
            </CardContent>
        </Card>
    );
}
