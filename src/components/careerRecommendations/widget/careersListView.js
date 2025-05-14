'use client';
import {useState} from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Menu,
    MenuItem,
    ListItemIcon
} from '@mui/material';
import styles from '../career.module.css';
import {InfinizeIcon} from '../../common';
import {theme} from '@/config';
import {InfinizeDialog} from '../../common';
import CareerDetails from '../generate/recommendations/careerDetails';

export default function CareersListView({careers = []}) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCareerIndex, setselectedCareerIndex] = useState(null);

    const handleMoreDetails = index => {
        setselectedCareerIndex(index);
        setIsDialogOpen(true);
    };

    const handleMenuOpen = (event, index) => {
        setMenuAnchor(event.currentTarget);
        setselectedCareerIndex(index);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setselectedCareerIndex(null);
    };

    const handleDeleteCareer = () => {
        handleMenuClose();
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <>
            <Stack
                className={styles.infinize__jobRecommendationsCards}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        sm: '1fr',
                        md: '1fr 1fr',
                        lg: '1fr 1fr 1fr'
                    },
                    gap: 2
                }} // TODO convert the Stack into Grid component
            >
                {careers.map((career, index) => (
                    <Box
                        key={index}
                        className={styles.infinize__jobRecommendationsEditCard}
                    >
                        <ListItemIcon
                            onClick={event => handleMenuOpen(event, index)}
                            className={
                                styles.infinize__jobRecommendationsMenuIcon
                            }
                        >
                            <InfinizeIcon
                                icon="mi:options-vertical"
                                className="menuItemIcon"
                            />
                        </ListItemIcon>

                        <Typography variant="h4" fontWeight="bold">
                            {career.title}
                        </Typography>

                        <Typography variant="body2">
                            {career.description}
                        </Typography>
                        <Box
                            className={
                                styles.infinize__jobRecommendationsSalary
                            }
                        >
                            <Typography variant="body2">
                                Match: {career.match}
                            </Typography>

                            <Button
                                onClick={() => handleMoreDetails(index)}
                                sx={{
                                    background: theme.palette.primary.main
                                }}
                            >
                                More Info
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Stack>
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuItem onClick={handleDeleteCareer} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="lucide:circle-minus"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Remove
                </MenuItem>
                <MenuItem
                    onClick={() => console.log(`share career `)}
                    className="menuItem"
                >
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="fluent:share-16-filled"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Share
                </MenuItem>
            </Menu>

            <InfinizeDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
            >
                {selectedCareerIndex !== null && (
                    <CareerDetails
                        career={careers[selectedCareerIndex]}
                        customStyles={{width: '100%', height: '500px'}} // TODO: have to replace with external styels
                        isEditable={false}
                    />
                )}
            </InfinizeDialog>
        </>
    );
}
