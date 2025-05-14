import React, {useState, useEffect} from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import {
    AddButton,
    DeleteButton,
    SelectField,
    TextInput,
    formUtils
} from '@/components/common';
import testScoresOptions from '@/data/advancedSearch/testScoresOptions.json';
import classes from '../advancedSearch.module.css';
import {AndOrToggle, ToggleSwitch} from './andOrToggle';
import SectionAccordion from './accordion';
import {AND, OR} from '@/config/constants';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export default function TestScores({
    onFilterChange,
    testScoresFilter,
    filterChips
}) {
    const TEST_SCORES = ADVANCED_SEARCH_SECTIONS.TEST_SCORES;
    const [expanded, setExpanded] = useState(false);
    const [testScoreSectionsList, setTestScoreSectionsList] = useState([]);
    const [testScores, setTestScores] = useState(testScoresOptions.tests || []);

    useEffect(() => {
        // Sync the length of testScoresFilter and testScoreSectionsList on component mount
        // Add an object to the testScoreSectionsList for each item that exists in testScoresFilter
        // This will ensure that all the items in the testScoresFilter will be displayed on component mount
        // If there are no filters added (testScoresFilter is empty), then to display one section by default, initialize testScoreSectionsList with one object
        setTestScoreSectionsList(
            testScoresFilter?.scores?.map((_, index) => ({
                id: index
            })) ?? [{id: 0}]
        );
    }, [testScoresFilter]); // Runs when `testScoresFilter` changes

    const handleFieldChange = (index, field, value) => {
        const updatedData = testScoresFilter?.scores ?? [];

        updatedData[index] = formUtils.getUpdatedFormData(
            updatedData[index] ?? {},
            field,
            value
        );

        const finalObject = {
            ...testScoresFilter,
            scores: updatedData
        };

        // If there are more than 1 test score filter, the default condition value should be AND
        if (updatedData.length > 1) {
            if (!testScoresFilter.condition) {
                finalObject.condition = AND;
            }
        }

        // Notify the parent component
        onFilterChange(TEST_SCORES, finalObject);
    };

    const handleChange = (field, value) => {
        // Notify the parent component
        onFilterChange(
            TEST_SCORES,
            formUtils.getUpdatedFormData(
                testScoresFilter ? {...testScoresFilter} : {},
                field,
                value
            )
        );
    };

    /**
     * Adds a new empty test score entry to the list.
     */
    const handleAddSection = () => {
        setTestScoreSectionsList([
            ...testScoreSectionsList,
            {id: testScoreSectionsList?.length}
        ]);
    };

    /**
     * Removes a test score entry from the list based on index.
     */
    const handleRemoveSection = index => {
        // Remove the test score section entry at the specified index
        const updatedList = [...testScoreSectionsList];
        updatedList.splice(index, 1);

        // Remove the test score entry from form data at the specified index
        const updatedScoresList = testScoresFilter?.scores
            ? [...testScoresFilter.scores]
            : [];
        updatedScoresList.splice(index, 1);

        setTestScoreSectionsList(updatedList);

        if (updatedScoresList.length <= 1) {
            delete testScoresFilter.condition;
        }

        // Update state and notify parent component
        onFilterChange(
            TEST_SCORES,
            formUtils.getUpdatedFormData(
                testScoresFilter,
                'scores',
                updatedScoresList
            )
        );
    };

    return (
        <SectionAccordion
            title="Test Scores"
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            filterChips={filterChips}
        >
            <Box display="flex" flexDirection="column" gap={3} mt={1}>
                {testScoreSectionsList.length > 1 && (
                    <ToggleSwitch
                        labelLeft="All Scores"
                        labelRight="At least one score"
                        checked={testScoresFilter?.condition === OR}
                        onChange={e =>
                            handleChange(
                                'condition',
                                e.target.checked ? OR : AND
                            )
                        }
                    />
                )}

                <Box display="flex" flexDirection="column" gap={2}>
                    {testScoreSectionsList.map((_, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <AndOrToggle
                                    isOr={testScoresFilter?.condition === OR}
                                />
                            )}
                            <Box
                                className={
                                    classes.infinize__advancedSearch__sectionsContainer
                                }
                            >
                                <Box
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: '1fr',
                                        sm: '1fr 1fr 1fr auto'
                                    }}
                                    gap={2}
                                    alignItems="center"
                                >
                                    <Box>
                                        <Typography className="infinize__inputLabel">
                                            Test*
                                        </Typography>
                                        <SelectField
                                            name={`test-${index}`}
                                            label="Test"
                                            value={
                                                testScoresFilter?.scores?.[
                                                    index
                                                ]?.test || ''
                                            }
                                            options={testScores.map(
                                                (option, idx) => ({
                                                    label: option.title,
                                                    value: option.title,
                                                    key: `title-${option.title}-${idx}`
                                                })
                                            )}
                                            onChange={val =>
                                                handleFieldChange(
                                                    index,
                                                    'test',
                                                    val
                                                )
                                            }
                                        />
                                    </Box>
                                    <Box>
                                        <Typography className="infinize__inputLabel">
                                            Test Filter*
                                        </Typography>
                                        <SelectField
                                            name={`testFilter-${index}`}
                                            label="Test Filter"
                                            value={
                                                testScoresFilter?.scores?.[
                                                    index
                                                ]?.testFilter || ''
                                            }
                                            options={[
                                                '=',
                                                '>',
                                                '<',
                                                '>=',
                                                '<='
                                            ]}
                                            onChange={val =>
                                                handleFieldChange(
                                                    index,
                                                    'testFilter',
                                                    val
                                                )
                                            }
                                        />
                                    </Box>
                                    <Box>
                                        <Typography className="infinize__inputLabel">
                                            Test Score*
                                        </Typography>
                                        <TextInput
                                            name={`testScore-${index}`}
                                            label="Test Score"
                                            value={
                                                testScoresFilter?.scores?.[
                                                    index
                                                ]?.testScore || ''
                                            }
                                            onChange={val =>
                                                handleFieldChange(
                                                    index,
                                                    'testScore',
                                                    val
                                                )
                                            }
                                        />
                                    </Box>
                                </Box>

                                {testScoreSectionsList.length > 1 && (
                                    <DeleteButton
                                        onClick={() =>
                                            handleRemoveSection(index)
                                        }
                                    />
                                )}
                            </Box>
                        </React.Fragment>
                    ))}
                </Box>

                <AddButton
                    onAdd={handleAddSection}
                    name={'Add'}
                    disabled={
                        testScoreSectionsList.length ===
                        testScoresFilter?.scores?.length
                    }
                />
            </Box>
        </SectionAccordion>
    );
}
