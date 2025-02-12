import { useState, useEffect } from 'react';
import { getStoryblokApi } from "@storyblok/react";
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

export default function Search({ blok }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const searchStories = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            const storyblokApi = getStoryblokApi();
            try {
                const { data } = await storyblokApi.get('cdn/stories', {
                    version: 'draft',
                    starts_with: 'coloring-pages/categories/',
                    excluding_slugs: 'coloring-pages/categories/*/pages/*',
                    search_term: query
                });
                setResults(data.stories);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce the search to avoid too many API calls
        const timeoutId = setTimeout(searchStories, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

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
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search coloring pages..." />
            </Paper>

            {isLoading ? <Loader message="Searching..." /> : (
                <>
                    {
                        results.length > 0 && (
                            <Grid container spacing={2}>
                                {results.map((result) => (
                                    <Grid key={result.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Link href={`/${result.full_slug.replace('categories/', '')}`}>
                                            <Paper
                                                sx={{
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
                                                }}
                                            >
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
                        )
                    }
                </>
            )}


            {query && !isLoading && results.length === 0 && (
                <Alert severity="info">
                    No results found. Try searching for something else.
                </Alert>
            )}
        </>
    );
} 