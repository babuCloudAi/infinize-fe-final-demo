'use client';
import {useState, useEffect} from 'react';
import {Box, Button, Skeleton, Stack} from '@mui/material';
import {Widget} from '@/components/common';
import notesData from '@/data/studentProfile/notes.json';
import styles from './notes.module.css';
import NotesCard from './notesCard';

export default function Notes() {
    const [expanded, setExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        setNotes(notesData.studentNotes);
    });

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 2000); // TODO remove this logic after API integration.
    }, []);

    const handleAccordionChange = () => {
        setExpanded(prev => !prev);
    };

    const handleViewAllNotes = e => {
        e.stopPropagation();
        console.log('View all Notes');
    };

    const handleAddNotes = e => {
        e.stopPropagation();
        console.log('Add Notes');
    };

    return (
        <Widget
            expanded={expanded}
            onChange={handleAccordionChange}
            title="Notes"
            actions={
                <Stack direction="row" gap={2}>
                    {notes.length > 3 && (
                        <Button variant="outlined" onClick={handleViewAllNotes}>
                            View All
                        </Button>
                    )}
                    <Button variant="contained" onClick={handleAddNotes}>
                        Add Note
                    </Button>
                </Stack>
            }
        >
            {isLoading && (
                <Stack direction="row" gap={2} p={2}>
                    <Skeleton variant="rectangular" width="33%" height={200} />
                    <Skeleton variant="rectangular" width="33%" height={200} />
                    <Skeleton variant="rectangular" width="33%" height={200} />
                </Stack>
            )}
            {!isLoading && (
                <Box
                    className={styles.infinize__notesCards}
                    display="grid"
                    gridTemplateColumns={{
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '1fr 1fr 1fr'
                    }}
                    gap={3}
                >
                    {notesData.studentNotes.slice(0, 3).map((note, index) => (
                        <NotesCard
                            key={note.id || `note-${index}`}
                            note={note}
                        />
                    ))}
                </Box>
            )}
        </Widget>
    );
}
