'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { Paper, Typography, Box, Chip, Alert, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Loader from '../Loader';
import Image from '../Image';

const getTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim());
};

const fetcher = (url) => fetch(url).then(res => res.json());

const PageCategory = ({ blok, story, pages = [] }) => {
  // Get the full category path from the story slug and remove trailing slash
  const categoryPath = story.full_slug.replace(/\/$/, '');

  const { data, error, isValidating } = useSWR(
    categoryPath ? `/api/search?path=${encodeURIComponent(categoryPath)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => console.error('SWR Error:', err)
    }
  );

  // Get a clean category name for display
  const categoryName = story.name || categoryPath.split('/').pop().split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Filter out any non-page items and sort by name
  const pageItems = data?.filter(item => item.full_slug.includes('/pages/')) || [];

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
          gap: 2,
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1">{categoryName} Coloring Pages</Typography>
        <Typography variant="body1">
          Check out these <b>{categoryName}</b> coloring pages! We have a selection of <b>{pageItems.length}</b> coloring pages for you to choose from.
        </Typography>
        {blok.tags && (
          <Box sx={{
            display: 'flex',
            gap: .5,
            flexWrap: 'wrap',
          }}>
            {getTags(blok.tags).map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </Paper>

      {isValidating ? (
        <Loader message="Loading coloring pages..." />
      ) : error ? (
        <Alert severity="error">Failed to load coloring pages. Please try again later.</Alert>
      ) : pageItems.length > 0 ? (
        <Grid container spacing={2}>
          {pageItems.map((page) => (
            <Grid key={page.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <Link href={`/${page.full_slug}`}>
                <Paper sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
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
                  <Typography variant="h6" component="h3">{page.name}</Typography>
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

export default PageCategory;
