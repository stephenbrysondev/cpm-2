'use client';

import useSWR from 'swr';
import { Container, Typography, Paper, Box, Button, Chip, Alert, Divider } from "@mui/material";
import Grid from '@mui/material/Grid2';
import Image from '../Image';
import DownloadIcon from '@mui/icons-material/Download';
import Loader from '../Loader';
import { useAuth } from '../../lib/context/AuthContext';
import { supabase } from '../../lib/supabase';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import React from 'react';
import Thumbnail from '../Thumbnail';

const getTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim());
};

const fetcher = (url) => fetch(url).then(res => res.json());

const getCategoryFromSlug = (fullSlug) => {
  const parts = fullSlug.split('/');
  const category = parts[2] || '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PageDetail = ({ blok, story, relatedPages = [] }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Check if page is saved on component mount
  React.useEffect(() => {
    if (user) {
      checkIfPageIsSaved();
    } else {
      setIsLoading(false);
    }
  }, [user, story.id]);

  const checkIfPageIsSaved = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_pages')
        .select('*')
        .eq('user_id', user.id)
        .eq('page_id', story.id);

      setIsSaved(data && data.length > 0);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      if (isSaved) {
        // Remove from saved pages
        await supabase
          .from('saved_pages')
          .delete()
          .eq('user_id', user.id)
          .eq('page_id', story.id);
        setIsSaved(false);
      } else {
        // Add to saved pages
        await supabase
          .from('saved_pages')
          .insert([
            {
              user_id: user.id,
              page_id: story.id,
              page_data: {
                title: blok.title,
                image: blok.image,
                slug: story.full_slug
              }
            }
          ]);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  // Get the category path by removing everything after the last folder
  const categoryPath = story.full_slug.split('/').slice(0, -1).join('/');

  const { data, error, isValidating } = useSWR(
    categoryPath ? `/api/search?path=${encodeURIComponent(categoryPath)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => console.error('SWR Error:', err)
    }
  );

  // Filter out the current page and ensure we only show related items
  const relatedItems = data?.filter(item =>
    item.id !== story.id
  ) || [];

  const handleDownload = () => {
    if (!blok?.image) return;
    const originalImageUrl = `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}${blok.image}`;
    const link = document.createElement('a');
    link.href = originalImageUrl;
    link.download = `${story.name}.png`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get category name for display
  const categoryName = categoryPath.split('/').pop().split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}
    >
      <Paper elevation={1} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            {blok.image && (
              <Image
                src={blok.image}
                alt={blok.title}
                width={528}
                priority // Always prioritize main image
              />
            )}
          </Grid>

          {/* Details Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              <Typography variant="h4" component="h1">
                {blok.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {blok.title} printable coloring page plus {relatedItems.length} free {categoryName} coloring pages, from easy to advanced. Perfect for kids and adults - download, print, and start coloring now!
              </Typography>

              {blok.tags && (
                <Box sx={{
                  display: 'flex',
                  gap: .5,
                  flexWrap: 'wrap',
                }}>
                  {getTags(blok.tags).map((tag, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      color="text.secondary"
                      sx={{ mr: 1 }}
                    >
                      #{tag}
                    </Typography>
                  ))}
                </Box>
              )}

              <Box sx={{
                display: 'flex',
                gap: 1,
                mt: 'auto'
              }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  disableElevation
                >
                  Download
                </Button>
                {user && !isLoading && (
                  <Button
                    variant="outlined"
                    startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    onClick={handleSave}
                    disableElevation
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h5" component="h2">More {categoryName} Coloring Pages</Typography>
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
        ) : relatedItems.length > 0 ? (

          <Grid container spacing={2} >
            {relatedItems.map((page) => (
              <Grid key={page.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Thumbnail href={`/${page.full_slug}`} image={page.content?.image} title={page.name} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">No related coloring pages found.</Alert>
        )}
      </Box>
    </Container>
  );
};

export default PageDetail;

