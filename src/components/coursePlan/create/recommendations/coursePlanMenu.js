'use client';
import {useState, useCallback} from 'react';
import {Menu, MenuItem, ListItemIcon, IconButton} from '@mui/material';
import {
    InfinizeIcon,
    InfinizeConfirmation,
    InfinizeDialog
} from '../../../common';
import TermData from '@/data/coursePlan/terms.json';
import {AutoCompleteSelect} from '@/components/common/form';

export default function CoursePlanMenu({
    onExpandAll,
    onCollapseAll,
    onRestart,
    setAllTerms,
    initialTerms,
    clearBanners,
    initialTotalCredits,
    setTotalCredits
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [selectTerm, setSelectTerm] = useState('');

    const toggle = setter => () => setter(prev => !prev);
    const toggleIsRestartDialogOpen = toggle(setIsRestartDialogOpen);
    const toggleIsResetDialogOpen = toggle(setIsResetDialogOpen);
    const [isAddTermDailogOpen, setIsAddTermDailogOpen] = useState(false);

    const open = Boolean(anchorEl);

    const handleMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleExpandAllClick = () => {
        handleMenuClose();
        onExpandAll();
    };

    const handleCollapseAllClick = () => {
        handleMenuClose();
        onCollapseAll();
    };

    const handleRestart = () => {
        handleMenuClose(); // Close the menu after action
        toggleIsRestartDialogOpen();
    };
    const handleAddTerm = () => {
        handleMenuClose();
        setIsAddTermDailogOpen(true);
    };

    const handleResetClick = () => {
        handleMenuClose();
        setIsResetDialogOpen(true);
    };

    const handleResetConfirm = useCallback(() => {
        setAllTerms(initialTerms);
        setTotalCredits(initialTotalCredits);
        clearBanners();
        setIsResetDialogOpen(false);
    }, [setAllTerms, initialTotalCredits, initialTerms, clearBanners]);

    const handleRestartContinue = () => {
        toggleIsRestartDialogOpen();
        onRestart();
    };

    const handleTermChange = value => {
        setSelectTerm(value);
    };

    const termOptions = TermData.Terms.filter(
        term =>
            !initialTerms.some(initialTerm => initialTerm.code === term.code)
    );

    const getOptionLabel = option => (option ? `${option.name}` : '');
    const isOptionEqualToValue = (option, value) => option.name === value.name;

    const handleTermAdd = selectedTerm => {
        setAllTerms(prevTerms => [...prevTerms, selectedTerm]);
        setIsAddTermDailogOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleMenuOpen}>
                <InfinizeIcon
                    icon="mi:options-vertical"
                    className="menuItemIcon"
                />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                className="menu"
                sx={{
                    '& .MuiPaper-root': {
                        marginLeft: 0,
                        marginTop: 0
                    }
                }}
            >
                <MenuItem onClick={handleExpandAllClick} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="mingcute:list-expansion-fill"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Expand All
                </MenuItem>
                <MenuItem onClick={handleCollapseAllClick} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="mingcute:list-collapse-fill"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Collapse All
                </MenuItem>
                <MenuItem onClick={handleAddTerm} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="streamline-quality-education"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Add Term
                </MenuItem>

                <MenuItem onClick={handleResetClick} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="ic:round-reset-tv"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Reset
                </MenuItem>
                <MenuItem onClick={handleRestart} className="menuItem">
                    <ListItemIcon>
                        <InfinizeIcon
                            icon="icon-park-outline:reload"
                            className="menuItemIcon"
                        />
                    </ListItemIcon>
                    Restart
                </MenuItem>
            </Menu>

            {/* Reset Dialog */}
            {isResetDialogOpen && (
                <InfinizeConfirmation
                    isOpen
                    onClose={toggleIsResetDialogOpen}
                    onConfirm={handleResetConfirm}
                    primaryButtonLabel="Reset"
                    title="Confirm Reset"
                    content="Are you sure you want to reset?"
                />
            )}

            {/* Restart Dialog */}
            {isRestartDialogOpen && (
                <InfinizeConfirmation
                    isOpen
                    onClose={toggleIsRestartDialogOpen}
                    primaryButtonLabel="continue"
                    onConfirm={handleRestartContinue}
                    title="Restart Course Plan"
                    content="To provide updated course plan you will be taken back to the preferences page to adjust inputs. Do you wish to continue?"
                />
            )}

            {/* Add Term Dailog */}
            {isAddTermDailogOpen && (
                <InfinizeDialog
                    isOpen
                    onClose={() => setIsAddTermDailogOpen(false)}
                    title="Add Term"
                    contentText="Select  the term you would like to add."
                    primaryButtonLabel="Continue"
                    onPrimaryButtonClick={() => handleTermAdd(selectTerm)}
                    isPrimaryButtonDisabled={!selectTerm}
                >
                    <AutoCompleteSelect
                        name="Term"
                        label="Select Term"
                        options={termOptions}
                        value={selectTerm}
                        onChange={handleTermChange}
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
                        minFilterLength={1}
                    />
                </InfinizeDialog>
            )}
        </>
    );
}
