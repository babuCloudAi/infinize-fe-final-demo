export const LOGO_ACCEPTED_FORMATS = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/svg+xml': ['.svg']
};
export const RESUME_ACCEPTED_FORMATS = 'application/pdf';

export const MAX_SIZE = 10 * 1024 * 1024;
export const BYTES = 1024;
export const FONT_OPTIONS = ['Poppins', 'Roboto Mono', 'Sans Serif'];

export const JOB_STATUS = {
    BRIGHT: 'Bright',
    AVERAGE: 'Average',
    BELOWAVERAGE: 'Below Average'
};
export const JOB_OUTLOOK = 'Job Outlook';
export const OBJECT = 'object';
export const OR = 'OR';
export const AND = 'AND';
export const ALERT = 'alert';
export const ADVANCED_SEARCH_SECTIONS = {
    PERFORMANCE: 'performance',
    AREA_OF_STUDY: 'areaOfStudy',
    ASSIGNED_TO: 'assignedTo',
    COURSE_DATA: 'courseData',
    REQUIRED: 'required',
    OPTIONAL: 'optional',
    COURSE_REQUIREMENTS: 'courseRequirements',
    REGISTRATION_HISTORY: 'registrationHistory',
    STUDENT_INFO: 'studentInfo',
    SYSTEM_ACTIVITY: 'systemActivity',
    TEST_SCORES: 'testScores'
};
export const CAREER_RECOMMENDATION_SECTIONS = {
    ADDITIONAL_AND_PREFERENCES: 'additionalAndPreferences',
    CAREER_GOALS_AND_INTERESTS: 'careerGoalsAndInterests',
    CERTIFICATIONS_AND_LICENSES: 'certificationsAndLicenses',
    CONSTRAINTS_AND_PRACTICAL_CONSIDERATIONS:
        'constraintsAndPracticalConsiderations',
    LOCATION_AND_WORK_ENVIRONMENT_PREFERENCES:
        'locationAndWorkEnvironmentPreferences',
    PAST_POSITIONS_INTERNSHIPS: 'pastPositionsInternships',
    PROJECTS_OR_PORTFOLIO_LINKS: 'projectsOrPortfolioLinks',
    SKILLS: 'skills'
};
export const COURSE_PLAN_SECTIONS = {
    ACADEMIC_CONSTRAINTS: 'academicConstraints',
    CAREER_GOALS: 'careerGoals',
    LEARNING_PERSONALIZATION: 'learningPersonalization',
    PERSONAL_INTERESTS: 'personalInterests'
};
export const MARKDOWN_SLOW_REVEAL_INTERVAL = 10;

export const CHART_METRICS = {
    PERCENTAGE: 'percentage',
    HOURS: 'hours'
};

export const LEGEND_PLACEMENT = {
    BELOW: 'below',
    ABOVE: 'above',
    LEFT: 'left',
    RIGHT: 'right'
};
export const ALERT_STATUS = {
    ALERT: 'alert',
    SUCCESS: 'success',
    FILTER_ALL: 'All',
    UNREAD: 'unread',
    KUDOS: 'kudosGiven',
    ACKNOWLEDGED: 'acknowledged',
    DISMISSED: 'dismissed',
    NUDGED: 'nudged'
};

export const ALERT_FILTER_LABELS = {
    unread: 'Unread',
    nudged: 'Nudged',
    kudosGiven: 'Kudos Given',
    acknowledged: 'Acknowledged',
    dismissed: 'Dismissed'
};
export const DATE_FORMAT = {
    SHORT: 'MM/DD/YYYY',
    LONG: 'MMM DD, YYYY hh:mm A'
};

export const TIMEZONE = 'America/New_York';
export const ASSIGN_TYPE = {
    INSTRUCTOR: 'Instructor',
    ADVISOR: 'Advisor',
    COACH: 'Coach'
};

export const ALERT_NO_RESULT_MESSAGES = {
    [ALERT_STATUS.UNREAD]: {
        title: 'No New Alerts to Review',
        description:
            'There are no new unread alerts at the moment. New updates will appear here.'
    },
    [ALERT_STATUS.KUDOS]: {
        title: 'No Kudos Sent Yet',
        description:
            'Recognitions and kudos sent to the student will appear here..'
    },
    [ALERT_STATUS.ACKNOWLEDGED]: {
        title: 'No Acknowledged Accomplishments',
        description: 'Accomplishments  acknowledged will appear here..'
    },
    [ALERT_STATUS.DISMISSED]: {
        title: 'No Alerts Yet',
        description: 'There are no alerts at the moment.'
    },
    [ALERT_STATUS.NUDGED]: {
        title: 'No Nudges Yet',
        description:
            'No nudges have been sent. Student reminders and prompts will be listed here.'
    }
};
