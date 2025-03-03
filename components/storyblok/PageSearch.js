'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { Paper, Typography, Box, Chip, Alert, Container, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Loader from '../Loader';
import Thumbnail from '../Thumbnail';

const getTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim());
};

const fetcher = (url) => fetch(url).then(res => res.json());

const PageSearch = ({ blok, story, pages = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    // Get the full category path from the story slug and remove trailing slash

    const { data, error, isValidating } = useSWR(
        `/api/search?q=${searchTerm}`,
        fetcher,
        {
            revalidateOnFocus: false,
            onError: (err) => console.error('SWR Error:', err)
        }
    );

    return (
        <Container
            // {...storyblokEditable(blok)}
            maxWidth="lg"
            disableGutters
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Paper
                sx={{
                    py: 12,
                    px: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h2" component="h1">Search</Typography>
                <Typography variant="body1">
                    Check out these
                </Typography>
                <TextField
                    fullWidth
                    label="Search"
                    sx={{
                        width: '100%',
                        maxWidth: '400px'
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Paper>

            {isValidating ? (
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Thumbnail loading={true} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Thumbnail loading={true} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Thumbnail loading={true} />
                    </Grid>
                </Grid>
            ) : error ? (
                <Alert severity="error">Failed to load coloring pages. Please try again later.</Alert>
            ) : data && data.length > 0 ? (
                <Grid container spacing={2}>
                    {data.map((page) => (
                        <Grid key={page.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Thumbnail href={`/${page.full_slug}`} image={page.content?.image} title={page.name} tags={getTags(page.content?.tags)} />
                        </Grid>
                    ))}
                </Grid>
            ) : searchTerm ? (
                <Alert severity="info">No coloring pages found for "{searchTerm}"</Alert>
            ) : null}
        </Container>
    );
};

export default PageSearch;
