'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Paper, TextField, Typography, Chip, Box, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { storyblokEditable } from '@storyblok/react';
import Image from '../Image';
import Loader from '../Loader';

const getTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim());
};

export default function Search({ blok, initialResults = [] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [results, setResults] = useState(initialResults);

    // Handle initial search from URL params
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    if (!Array.isArray(data)) throw new Error('Invalid response');
                    setResults(data);
                })
                .catch(error => {
                    console.error('Search error:', error);
                    setResults([]);
                });
        }
    }, [searchParams]); // Run only on mount

    const handleSearch = (term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });

        // Optimistic update
        if (!term) {
            setResults([]);
            return;
        }

        fetch(`/api/search?q=${encodeURIComponent(term)}`)
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) throw new Error('Invalid response');
                setResults(data);
            })
            .catch(error => {
                console.error('Search error:', error);
                setResults([]);
            });
    };

    // Debounce the search input
    const handleSearchDebounced = (e) => {
        const value = e.target.value;
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => handleSearch(value), 300);
    };

    return (
        <>
            <Paper {...storyblokEditable(blok)}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <TextField
                    id="search-input"
                    label="Search for anything..."
                    variant="outlined"
                    onChange={handleSearchDebounced}
                    defaultValue={searchParams.get('q') || ''}
                    placeholder="Search coloring pages..."
                />
            </Paper>

            {isPending ? <Loader message="Searching..." /> : (
                <>
                    {results.length > 0 && (
                        <Grid container spacing={2}>
                            {results.map((result) => (
                                <Grid key={result.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Link href={`/${result.full_slug.replace('categories/', '')}`}>
                                        <Paper sx={{
                                            p: 4,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            cursor: 'pointer',
                                            transition: 'box-shadow 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}>
                                            {result.content?.image && (
                                                <Image
                                                    src={result.content.image}
                                                    alt={result.name}
                                                />
                                            )}
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}>
                                                <Typography variant="h5">
                                                    {result.name}
                                                </Typography>
                                                {result.content?.tags && (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: .5,
                                                        flexWrap: 'wrap',
                                                        mt: 'auto'
                                                    }}>
                                                        {getTags(result.content.tags).map((tag, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={tag}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Paper>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            {searchParams.get('q') && !isPending && results.length === 0 && (
                <Alert severity="info">
                    No results found. Try searching for something else.
                </Alert>
            )}
        </>
    );
} 