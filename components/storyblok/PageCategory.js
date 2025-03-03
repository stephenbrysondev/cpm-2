'use client';

import useSWR from 'swr';
import { Paper, Typography, Box, Chip, Alert, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Loader from '../Loader';
import Thumbnail from '../Thumbnail';
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

  // Filter out the folder itself and sort by name
  const pageItems = data?.filter(item => item.full_slug !== categoryPath) || [];

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
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Thumbnail loading={true} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Thumbnail loading={true} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Thumbnail loading={true} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Thumbnail loading={true} />
          </Grid>
        </Grid>
      ) : error ? (
        <Alert severity="error">Failed to load coloring pages. Please try again later.</Alert>
      ) : pageItems.length > 0 ? (
        <Grid container spacing={2}>
          {pageItems.map((page) => (
            <Grid key={page.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <Thumbnail href={`/${page.full_slug}`} image={page.content?.image} title={page.name} loading={isValidating} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">No coloring pages found in this category.</Alert>
      )
      }
    </Container >
  );
};

export default PageCategory;
