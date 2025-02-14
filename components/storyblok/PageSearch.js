'use client';

import useSWR from 'swr';
import { useState } from 'react';
import Link from 'next/link';
import { Paper, Typography, Alert, Container, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Loader from '../Loader';
import Image from '../Image';

const getTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim());
};

const fetcher = (url) => fetch(url).then(res => res.json());

const PageSearch = ({ blok, story, pages = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    console.log('debug', story);
    // Get the full category path from the story slug and remove trailing slash

    const { data, error, isValidating } = useSWR(searchTerm ? `/api/search?q=${searchTerm}` : null,
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
                <Loader message="Loading coloring pages..." />
            ) : error ? (
                <Alert severity="error">Failed to load coloring pages. Please try again later.</Alert>
            ) : data && data.length > 0 ? (
                <Grid container spacing={2}>
                    {data.map((page) => (
                        <Grid key={page.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Link href={`/${page.full_slug}`}>
                                <Paper sx={{
                                    p: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': { boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }
                                }}>
                                    {page.content?.image && (
                                        <Image
                                            src={page.content.image}
                                            alt={page.name}
                                            priority={page.index < 3} // Prioritize first 3 images
                                        />
                                    )}
                                    <Typography variant="h5">{page.name}</Typography>
                                </Paper>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert severity="info">No coloring pages found in this category.</Alert>
            )}
        </Container>
    );
};

export default PageSearch;
