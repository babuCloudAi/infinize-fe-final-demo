'use client';
import React, {useState} from 'react';
import {Box, Typography, IconButton} from '@mui/material';
import {useRouter} from 'next/navigation';
import SaveSearchDialog from './saveSearchDialog';
import ActionButtons from './actionButtons';
import SavedSearchesPopup from '../savedSearchesPopup';
import AdvancedSearchForm from './form';
import studentSearchStyles from '../search.module.css';
import advancedSearchStyles from './advancedSearch.module.css';
import {InfinizeIcon} from '../../common';
import SearchResults from '../searchResults';
import {
    filterValidCourseData,
    filterValidCourseRequirements,
    filterValidTestScores,
    getFilterChips,
    handleRemoveFilterChip
} from './searchHelpers';
import {
    studentInfo,
    systemActivity,
    areaOfStudy,
    assignedTo,
    performance,
    registrationHistory
} from './form/labels';

export default function AdvancedSearch() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isShowResults, setIsShowResults] = useState(false);
    const [isFromAdvancedSearchResults, setIsFromAdvancedSearchResults] =
        useState(false);

    // Disable Search button if no filters are applied
    const isSearchButtonDisabled = Object.keys(formData).length === 0;

    // Toggle the results view (show/hide results panel)
    const toggleIsShowResults = () => {
        setIsShowResults(prev => !prev);
    };

    // Called when a filter field changes
    const onFilterChange = (field, value) => {
        if (Object.keys(value).length === 0) {
            // Remove the field if it's empty
            delete formData[field];
            setFormData({...formData});
        } else {
            // Update the field in formData
            setFormData({...formData, [field]: value});
        }
    };

    // Clear all filters
    const handleReset = () => {
        setFormData({});
    };

    // Perform search with cleaned data
    const handleSearch = () => {
        toggleIsShowResults();

        const requestBody = {...formData};

        // Clean up nested courseData
        const validCourseData = filterValidCourseData(formData.courseData);
        if (validCourseData) {
            requestBody.courseData = validCourseData;
        } else {
            delete requestBody.courseData;
        }

        // Clean up nested courseRequirements
        const validCourseRequirements = filterValidCourseRequirements(
            formData.courseRequirements
        );
        if (validCourseRequirements) {
            requestBody.courseRequirements = validCourseRequirements;
        } else {
            delete requestBody.courseRequirements;
        }

        // Clean up nested testScores
        const validTestScores = filterValidTestScores(formData.testScores);
        if (validTestScores) {
            requestBody.testScores = validTestScores;
        } else {
            delete requestBody.testScores;
        }

        console.log('Cleaned request body', requestBody);

        // TODO: Replace with actual API call
    };

    // Show results after clicking 'Advanced Search'
    const handleAdvancedSearch = () => {
        setIsFromAdvancedSearchResults(true);
        toggleIsShowResults();
    };

    // Handle cancel action
    const handleCancel = () => {
        // If navigating from Advanced Search Results, just toggle back
        if (isFromAdvancedSearchResults) {
            toggleIsShowResults();
        } else {
            // Otherwise go back to the previous page
            router.back();
        }
    };

    // Placeholder for future Save feature
    const handleSave = value => {
        // TODO: Implement save logic
    };
    const sectionLabels = {
        studentInfo,
        systemActivity,
        areaOfStudy,
        assignedTo,
        performance,
        registrationHistory,
        courseData: {},
        courseRequirements: {},
        testScores: {}
    };
    // For generating filter chips by section
    const getChipsForSection = section => {
        return getFilterChips(section, formData, sectionLabels);
    };

    // Remove a chip from a section
    const handleChipRemove = (section, index, type) => {
        handleRemoveFilterChip(section, index, type, setFormData, formData);
    };
    const getAllSectionChips = () => {
        return {
            studentInfo: getChipsForSection('studentInfo'),
            systemActivity: getChipsForSection('systemActivity'),
            areaOfStudy: getChipsForSection('areaOfStudy'),
            assignedTo: getChipsForSection('assignedTo'),
            performance: getChipsForSection('performance'),
            registrationHistory: getChipsForSection('registrationHistory'),
            courseData: getChipsForSection('courseData'),
            courseRequirements: getChipsForSection('courseRequirements'),
            testScores: getChipsForSection('testScores')
        };
    };
    return (
        <Box sx={{width: '100%', overflowX: 'auto'}}>
            {!isShowResults && (
                <Box
                    className={
                        advancedSearchStyles.infinize__advancedSearch__container
                    }
                >
                    <Box
                        className={
                            advancedSearchStyles.infinize__advancedSearch__title
                        }
                    >
                        <Typography variant="h5" gutterBottom m={0}>
                            Advanced Search
                        </Typography>
                        <Box display={'flex'} gap={1} alignContent={'baseline'}>
                            <IconButton
                                aria-label="reset"
                                className={
                                    studentSearchStyles.infinize__savedSearches
                                }
                                onClick={handleReset}
                            >
                                <InfinizeIcon icon={'ic:round-reset-tv'} />
                            </IconButton>
                            <Box
                                className={
                                    studentSearchStyles.infinize__savedSearches
                                }
                            >
                                <SavedSearchesPopup
                                    topAlignment="right"
                                    bottomAlignment="left"
                                    anchorVertical="top"
                                    transformVertical="top"
                                />
                            </Box>
                        </Box>
                    </Box>
                    <AdvancedSearchForm
                        onFilterChange={onFilterChange}
                        formData={formData}
                        getSelectedChips={getChipsForSection}
                        onRemoveChip={handleChipRemove}
                    />
                    <Box
                        display="flex"
                        gap={2}
                        width="100%"
                        className={
                            advancedSearchStyles.infinize__advancedSearch__buttons__group
                        }
                    >
                        <ActionButtons
                            formData={formData}
                            handleSearch={handleSearch}
                            handleCancel={handleCancel}
                            handleSave={setIsOpen}
                            isDisabled={isSearchButtonDisabled}
                        />
                        <SaveSearchDialog
                            open={isOpen}
                            onClose={() => setIsOpen(false)}
                            onSave={handleSave}
                        />
                    </Box>
                </Box>
            )}
            {isShowResults && (
                <Box sx={{width: '100%', overflowX: 'auto'}}>
                    <SearchResults
                        selectedChips={getAllSectionChips()}
                        isAdvanced={true}
                        onClick={handleAdvancedSearch}
                    />
                </Box>
            )}
        </Box>
    );
}
