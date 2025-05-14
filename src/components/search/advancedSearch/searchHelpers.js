import {ADVANCED_SEARCH_SECTIONS} from '@/config/constants';

export const filterValidCourseData = courseData => {
    if (!courseData) return undefined;

    const {subject, courseNumber, ...rest} = courseData;

    const isValidSubject = typeof subject === 'string' && subject.trim() !== '';
    const isValidCourseNumber =
        typeof courseNumber === 'string' && courseNumber.trim() !== '';

    if (!isValidSubject || !isValidCourseNumber) {
        return undefined;
    }

    return {
        subject: subject.trim(),
        courseNumber: courseNumber.trim(),
        ...rest
    };
};

/**
 * Filters out invalid required and optional course entries
 * where the 'course' field is empty or missing.
 *
 * @param {Object} courseRequirements - Object with required and optional courses.
 * @returns {Object|undefined} - Filtered object or undefined if no valid data.
 */
export const filterValidCourseRequirements = courseRequirements => {
    if (!courseRequirements) return undefined;

    console.log('Received courseRequirements:', courseRequirements);

    const filterCourses = arr =>
        Array.isArray(arr) ? arr.filter(item => item.course !== '') : [];

    const required = filterCourses(courseRequirements.required);
    const optional = filterCourses(courseRequirements.optional?.courses); // Adjust this if optional is a plain array

    if (!required.length && !optional.length) return undefined;

    return {
        ...(required.length && {required}),
        ...(optional.length && {optional})
    };
};

/**
 * Filters testScores to include only those with all required fields: test, filter, and score.
 *
 * @param {Array} testScores - Array of test score objects.
 * @returns {Array|undefined} - Array of valid test scores or undefined if none valid.
 */
export const filterValidTestScores = testScores => {
    if (!Array.isArray(testScores)) return undefined;

    const valid = testScores.filter(
        row =>
            row.test &&
            row.filter &&
            row.score !== undefined &&
            row.score !== null
    );

    return valid.length ? valid : undefined;
};

/**
 * Utility to generate chip labels from formData for a given section.
 */
export const getFilterChips = (section, formData, sectionLabels) => {
    const sectionFilters = formData[section];
    if (!sectionFilters) return [];

    switch (section) {
        case ADVANCED_SEARCH_SECTIONS.ASSIGNED_TO: {
            const {assignType, name} = sectionFilters || {};
            if (assignType && name) {
                return [
                    {
                        label: assignType,
                        type: ADVANCED_SEARCH_SECTIONS.ASSIGNED_TO,
                        index: 0 // Index isn't meaningful here but included for consistency
                    }
                ];
            }
            return [];
        }

        case ADVANCED_SEARCH_SECTIONS.TEST_SCORES: {
            if (Array.isArray(sectionFilters.scores)) {
                return sectionFilters.scores
                    .map((score, index) => {
                        const {test, testFilter, testScore} = score || {};

                        const hasAllValues =
                            test &&
                            testFilter &&
                            testScore !== undefined &&
                            testScore !== '';

                        if (hasAllValues) {
                            return {
                                label: `${test} ${testFilter} ${testScore}`,
                                type: ADVANCED_SEARCH_SECTIONS.TEST_SCORES,
                                index
                            };
                        }

                        return null;
                    })
                    .filter(Boolean);
            }
            return [];
        }

        case ADVANCED_SEARCH_SECTIONS.COURSE_DATA: {
            if (Array.isArray(sectionFilters.courses)) {
                return sectionFilters.courses
                    .map((course, index) => {
                        if (course.subject && course.courseNumber) {
                            return {
                                label: `${course.subject} - ${course.courseNumber}`,
                                type: ADVANCED_SEARCH_SECTIONS.COURSE_DATA,
                                index
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);
            }
            return [];
        }

        case ADVANCED_SEARCH_SECTIONS.COURSE_REQUIREMENTS: {
            const chips = [];
            const formatCourse = course => {
                if (!course) return '';

                if (typeof course === 'object' && course !== null) {
                    // Try to safely build a course string from known fields
                    const {subject, number, title} = course;
                    return [subject, number, title].filter(Boolean).join(' - ');
                }

                const courseStr = String(course).trim();
                const parts = courseStr.split(/\s+/);
                return parts.length >= 2
                    ? `${parts[0]} - ${parts.slice(1).join(' ')}`
                    : courseStr;
            };

            const requiredCourses = sectionFilters.required || [];
            requiredCourses.forEach((item, index) => {
                if (item.course) {
                    chips.push({
                        label: `Required: ${formatCourse(item.course)}`,
                        index,
                        type: ADVANCED_SEARCH_SECTIONS.REQUIRED
                    });
                }
            });

            const optionalCourses = sectionFilters.optional?.courses || [];
            optionalCourses.forEach((item, index) => {
                if (item.course) {
                    chips.push({
                        label: `Optional: ${formatCourse(item.course)}`,
                        index,
                        type: ADVANCED_SEARCH_SECTIONS.OPTIONAL
                    });
                }
            });

            return chips;
        }

        default: {
            const newSection = sectionLabels[section];
            if (newSection && sectionFilters) {
                return Object.entries(sectionFilters)
                    .map(([key, value]) =>
                        value ? newSection[key] || key : null
                    )
                    .filter(Boolean);
            }
        }
    }
};

/**
 * Utility to remove chip from formData based on section, index, and type.
 */
export const handleRemoveFilterChip = (
    section,
    index,
    type,
    setFormData,
    formData
) => {
    const updated = {...formData}; // Use formData directly

    switch (section) {
        case ADVANCED_SEARCH_SECTIONS.ASSIGNED_TO: {
            delete updated.assignedTo;
            break;
        }

        case ADVANCED_SEARCH_SECTIONS.COURSE_REQUIREMENTS: {
            const courseReq = updated.courseRequirements || {};
            const required = [...(courseReq.required || [])];
            const optionalCourses = [...(courseReq.optional?.courses || [])];

            if (type === ADVANCED_SEARCH_SECTIONS.REQUIRED) {
                required.splice(index, 1);
            } else if (type === ADVANCED_SEARCH_SECTIONS.OPTIONAL) {
                optionalCourses.splice(index, 1);
            }

            const updatedCourseReq = {};
            if (Object.keys(updatedCourseReq).length) {
                updated.courseRequirements = updatedCourseReq;
            } else {
                delete updated.courseRequirements;
            }
            break;
        }

        case ADVANCED_SEARCH_SECTIONS.TEST_SCORES: {
            const scores = [...(updated.testScores?.scores || [])];
            scores.splice(index, 1);
            if (scores.length) {
                updated.testScores = {...updated.testScores, scores};
            } else {
                delete updated.testScores;
            }
            break;
        }

        case ADVANCED_SEARCH_SECTIONS.COURSE_DATA: {
            const courses = [...(updated.courseData?.courses || [])];
            courses.splice(index, 1);
            if (courses.length) {
                updated.courseData = {...updated.courseData, courses};
            } else {
                delete updated.courseData;
            }
            break;
        }

        default: {
            const sectionData = updated[section];
            if (sectionData) {
                const filtered = Object.entries(sectionData).filter(
                    (_, i) => i !== index
                );

                if (filtered.length) {
                    updated[section] = Object.fromEntries(filtered);
                } else {
                    delete updated[section];
                }
            }
            break;
        }
    }

    setFormData(updated); // Update formData state here
};
