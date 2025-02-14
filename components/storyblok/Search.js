'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { Paper, TextField, Typography, Chip, Box, Alert, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { storyblokEditable } from '@storyblok/react';
import Image from '../Image';
import Loader from '../Loader';

const getTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim());
};

// Fetcher function for useSWR
const fetcher = (url) => fetch(url).then(res => res.json());

export default function Search({ blok, initialResults = [] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [page, setPage] = useState(1);

    const { data, error, isValidating } = useSWR(
        query ? `/api/search?q=${encodeURIComponent(query)}&page=${page}` : null,
        fetcher,
        { revalidateOnFocus: false }
    );

    // Debounced search effect
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (query) {
                router.replace(`${pathname}?q=${query}`);
            } else {
                router.replace(pathname);
            }
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [query, router, pathname]);

    const handleSearch = (e) => {
        setQuery(e.target.value);
        setPage(1);
    };

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
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
                    onChange={handleSearch}
                    value={query}
                    placeholder="Search coloring pages..."
                />
            </Paper>

            {isValidating ? <Loader message="Searching..." /> : (
                <>
                    {data?.length > 0 && (
                        <Grid container spacing={2}>
                            {data.map((result) => (
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

                    {/* Load More Button for Pagination */}
                    {data?.length > 0 && (
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button variant="contained" onClick={handleLoadMore} disabled={isValidating}>
                                {isValidating ? 'Loading...' : 'Load More'}
                            </Button>
                        </Box>
                    )}
                </>
            )}

            {query && !isValidating && data?.stories?.length === 0 && (
                <Alert severity="info">
                    No results found. Try searching for something else.
                </Alert>
            )}
        </>
    );
}