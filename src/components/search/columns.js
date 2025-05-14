import Link from 'next/link';
import classes from './search.module.css';
import {InfinizeIcon} from '../common';

const columns = [
    {
        field: 'name',
        headerName: 'Full Name',
        description: 'Full name of the student with a clickable profile link',
        width: 180,
        renderCell: params => (
            <Link
                href={`/student/${params.row.studentId}`}
                target="_blank"
                passHref
                className={classes.infinize__studentName}
                aria-label={`View profile of ${params.value}`}
            >
                <InfinizeIcon
                    icon="line-md:link"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden="true"
                />
                <span>{params.value}</span>
            </Link>
        )
    },
    {
        field: 'studentId',
        headerName: 'ID',
        description: 'Unique Student ID',
        width: 130
    },
    {
        field: 'email',
        headerName: 'Email',
        description: 'Student email address',
        width: 250
    },
    {
        field: 'cohort',
        headerName: 'Cohort',
        description: 'Student’s enrollment cohort',
        width: 120
    },
    {
        field: 'academicStanding',
        headerName: 'Academic Standing',
        description: 'Current academic standing',
        width: 170
    },
    {
        field: 'studentLevel',
        headerName: 'Student Level',
        description: 'Undergraduate or Graduate status',
        width: 150
    },
    {
        field: 'studentType',
        headerName: 'Student Type',
        description: 'Full-time or Part-time student',
        width: 130
    },
    {
        field: 'college',
        headerName: 'College',
        description: 'College of enrollment',
        width: 200
    },
    {
        field: 'department',
        headerName: 'Department',
        description: 'Department of study',
        width: 200
    },
    {
        field: 'program',
        headerName: 'Program',
        description: 'Academic program of study',
        width: 200
    },
    {
        field: 'major',
        headerName: 'Major',
        description: 'Primary major',
        width: 150
    },
    {
        field: 'minor',
        headerName: 'Minor',
        description: 'Secondary minor',
        width: 150
    },
    {
        field: 'concentration',
        headerName: 'Concentration',
        description: 'Specific concentration within major',
        width: 200
    },
    {
        field: 'registeredCurrentTerm',
        headerName: 'Registered for Current Term',
        description: 'Indicates whether student is registered this term',
        width: 200
    },
    {
        field: 'currentTermCredits',
        headerName: 'Current Term Credits',
        description: 'Credits taken in the current term',
        width: 150
    },
    {
        field: 'registeredNextTerm',
        headerName: 'Registered for Next Term',
        description:
            'Indicates whether student is registered for the next term',
        width: 200
    },
    {
        field: 'nextTermCredits',
        headerName: 'Next Term Credits',
        description: 'Credits planned for next term',
        width: 150
    },
    {
        field: 'totalCredits',
        headerName: 'Total Credits Earned',
        description: 'Total credits earned so far',
        width: 150
    },
    {
        field: 'pellEligible',
        headerName: 'Pell Eligible',
        description: 'Eligibility for Pell Grant',
        width: 120
    },
    {
        field: 'cumulativeGpa',
        headerName: 'Cumulative GPA',
        description: 'Overall GPA of student',
        width: 120
    }
];

export default columns;
