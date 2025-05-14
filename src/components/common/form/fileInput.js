import {useDropzone} from 'react-dropzone';
import {useState, useRef, useCallback} from 'react';
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import Image from 'next/image';
import classes from './formFields.module.css';
import {InfinizeIcon} from '..';
import {BYTES, MAX_SIZE} from '@/config/constants';
import Link from 'next/link';

export default function FileInput({
    file,
    setFile,
    label = 'Click to Upload',
    acceptedFormats
}) {
    const [errorMessage, setErrorMessage] = useState('');
    const [fileDetails, setFileDetails] = useState(null);
    const [filePreviewURL, setFilePreviewURL] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = file => {
        if (!file) return;

        if (!acceptedFormats?.includes(file.type)) {
            setErrorMessage('Invalid file format. Please upload a valid file.');
            return;
        }

        setFile(file);
        setFileDetails({
            name: file.name,
            size: `${(file.size / BYTES).toFixed(2)} KB`,
            type: file.type
        });

        // Optional: If you only want preview for certain types, handle that in the parent or add a preview flag prop
        setFilePreviewURL(URL.createObjectURL(file));
    };

    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        setErrorMessage('');

        if (fileRejections.length) {
            setErrorMessage(
                'Invalid file format or size. Please upload a valid file.'
            );
            return;
        }

        handleFileUpload(acceptedFiles[0]);
    }, []);

    const {getRootProps, getInputProps} = useDropzone({
        accept: acceptedFormats,
        maxSize: MAX_SIZE,
        onDrop
    });

    const handleEditClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Box>
            {file && (
                <Card
                    className={classes.infinize__fileInputCard}
                    variant="outlined"
                >
                    <CardContent
                        className={classes.infinize__fileInputCardContent}
                    >
                        <Box mt={1}>
                            <Image
                                src="/img/uploadFile.svg"
                                alt="Upload icon"
                                width={50}
                                height={20}
                                priority
                            />
                        </Box>
                        <Box>
                            <Typography
                                className={
                                    classes.infinize__fileInputFileDetails
                                }
                            >
                                {fileDetails?.name}
                            </Typography>
                            <Typography
                                className={classes.infinize__fileInputFileSize}
                            >
                                {fileDetails?.size}
                            </Typography>
                            {filePreviewURL && (
                                <Link
                                    href={filePreviewURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={classes.infinize__filePreview}
                                    sx={{color: 'primary.main'}}
                                >
                                    Click to view
                                </Link>
                            )}
                        </Box>
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={handleEditClick}>
                            <InfinizeIcon
                                icon="akar-icons:edit"
                                alt="Edit icon"
                                className={
                                    classes.infinize__fileInputEditButton
                                }
                            />
                        </IconButton>
                    </CardActions>
                </Card>
            )}
            {!file && (
                <Box
                    {...getRootProps()}
                    className={classes.infinize__fileInputDropzone}
                >
                    <input {...getInputProps()} />
                    <Box
                        display={'inline-flex'}
                        p={1}
                        className={classes.infinize__fileUploadIcon}
                    >
                        <Image
                            src="/img/file.svg"
                            alt="Upload icon"
                            width={30}
                            height={30}
                            priority
                        />
                    </Box>
                    <Typography
                        className={classes.infinize__fileInputUploadText}
                    >
                        <Typography
                            component="span"
                            sx={{color: 'primary.main'}}
                        >
                            {label}
                        </Typography>
                        &nbsp;or drag and drop <br />
                        (Max. File size: {MAX_SIZE / BYTES / BYTES}
                        MB)
                    </Typography>
                </Box>
            )}
            {errorMessage && (
                <Typography className={classes.infinize__fileInputErrorMessage}>
                    {errorMessage}
                </Typography>
            )}
            <input
                type="file"
                accept={Object.values(acceptedFormats || {})
                    .flat()
                    .join(',')}
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={e => handleFileUpload(e.target.files[0])}
            />
        </Box>
    );
}
