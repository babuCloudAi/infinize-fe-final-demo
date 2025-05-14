import React from 'react';
import {Box} from '@mui/material';
import StudentInfo from './studentInfo';
import SystemActivity from './systemActivity';
import RegistrationHistory from './registrationHistory';
import AreaOfStudy from './areaOfStudy';
import Performance from './performance';
import AssignedTo from './assignedTo';
import CourseData from './courseData';
import CourseRequirements from './courseRequirements';
import TestScores from './testScores';
import {ObjectFilterChips, StringFilterChips} from './filterChips';
import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export default function AdvancedSearchForm({
    onFilterChange,
    formData,
    getSelectedChips,
    onRemoveChip
}) {
    return (
        <Box
            height={'100vh'}
            sx={{padding: '0px 24px 24px 24px', overflowY: 'auto'}}
        >
            <StudentInfo
                sectionName={ADVANCED_SEARCH_SECTIONS.STUDENT_INFO}
                onFilterChange={onFilterChange}
                studentInfoFilter={formData.studentInfo}
                filterChips={
                    <StringFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.STUDENT_INFO
                        )}
                        onRemoveChip={index =>
                            onRemoveChip(
                                ADVANCED_SEARCH_SECTIONS.STUDENT_INFO,
                                index
                            )
                        }
                    />
                }
            />
            <SystemActivity
                sectionName={ADVANCED_SEARCH_SECTIONS.SYSTEM_ACTIVITY}
                onFilterChange={onFilterChange}
                systemActivityFilter={formData.systemActivity}
                filterChips={
                    <StringFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.SYSTEM_ACTIVITY
                        )}
                        onRemoveChip={index =>
                            onRemoveChip(
                                ADVANCED_SEARCH_SECTIONS.SYSTEM_ACTIVITY,
                                index
                            )
                        }
                    />
                }
            />
            <RegistrationHistory
                sectionName={ADVANCED_SEARCH_SECTIONS.REGISTRATION_HISTORY}
                onFilterChange={onFilterChange}
                registrationHistoryFilter={formData.registrationHistory}
                filterChips={
                    <StringFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.REGISTRATION_HISTORY
                        )}
                        onRemoveChip={index =>
                            onRemoveChip(
                                ADVANCED_SEARCH_SECTIONS.REGISTRATION_HISTORY,
                                index
                            )
                        }
                    />
                }
            />
            <AreaOfStudy
                sectionName={ADVANCED_SEARCH_SECTIONS.AREA_OF_STUDY}
                onFilterChange={onFilterChange}
                areaOfStudyFilter={formData.areaOfStudy}
                filterChips={
                    <StringFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.AREA_OF_STUDY
                        )}
                        onRemoveChip={index =>
                            onRemoveChip(
                                ADVANCED_SEARCH_SECTIONS.AREA_OF_STUDY,
                                index
                            )
                        }
                    />
                }
            />
            <Performance
                sectionName={ADVANCED_SEARCH_SECTIONS.PERFORMANCE}
                onFilterChange={onFilterChange}
                performanceFilter={formData.performance}
                filterChips={
                    <StringFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.PERFORMANCE
                        )}
                        onRemoveChip={index =>
                            onRemoveChip(
                                ADVANCED_SEARCH_SECTIONS.PERFORMANCE,
                                index
                            )
                        }
                    />
                }
            />
            <AssignedTo
                sectionName={ADVANCED_SEARCH_SECTIONS.ASSIGNED_TO}
                onFilterChange={onFilterChange}
                assignedToFilter={formData.assignedTo}
                filterChips={
                    <ObjectFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.ASSIGNED_TO
                        )}
                        onRemoveChip={index =>
                            onRemoveChip(
                                ADVANCED_SEARCH_SECTIONS.ASSIGNED_TO,
                                index
                            )
                        }
                    />
                }
            />
            <CourseData
                sectionName={ADVANCED_SEARCH_SECTIONS.COURSE_DATA}
                onFilterChange={onFilterChange}
                courseDataFilter={formData.courseData}
                filterChips={
                    <ObjectFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.COURSE_DATA
                        )}
                        onRemoveChip={index =>
                            onRemoveChip(
                                ADVANCED_SEARCH_SECTIONS.COURSE_DATA,
                                index
                            )
                        }
                    />
                }
            />
            <CourseRequirements
                sectionName={ADVANCED_SEARCH_SECTIONS.COURSE_REQUIREMENTS}
                onFilterChange={onFilterChange}
                courseRequirementsFilter={formData.courseRequirements}
                filterChips={
                    <ObjectFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.COURSE_REQUIREMENTS
                        )}
                        onRemoveChip={onRemoveChip}
                        section={ADVANCED_SEARCH_SECTIONS.COURSE_REQUIREMENTS}
                    />
                }
            />

            <TestScores
                sectionName={ADVANCED_SEARCH_SECTIONS.TEST_SCORES}
                onFilterChange={onFilterChange}
                testScoresFilter={formData.testScores}
                filterChips={
                    <ObjectFilterChips
                        chips={getSelectedChips(
                            ADVANCED_SEARCH_SECTIONS.TEST_SCORES
                        )}
                        onRemoveChip={index =>
                            onRemoveChip(
                                ADVANCED_SEARCH_SECTIONS.TEST_SCORES,
                                index
                            )
                        }
                    />
                }
            />
        </Box>
    );
}
