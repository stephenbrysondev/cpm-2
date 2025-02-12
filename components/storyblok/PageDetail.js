import { storyblokEditable, getStoryblokApi } from "@storyblok/react";
import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Box, Divider, Link } from "@mui/material";
import Loader from '../Loader';
import Grid from '@mui/material/Grid2';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { useAuth } from "../../lib/context/AuthContext";
import Image from '../Image';

const getCategoryFromSlug = (fullSlug) => {
  const parts = fullSlug.split('/');
  const category = parts[2] || '';
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PageDetail = ({ blok, story }) => {
  const { user } = useAuth();
  const [relatedPages, setRelatedPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get('cdn/stories', {
          version: 'draft',
          starts_with: `${story.full_slug.replace(story.slug, '')}`,
          excluding_slugs: story.full_slug  // Exclude current page
        });

        setRelatedPages(data.stories);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (story) {
      fetchPages();
    }
  }, [story]);

  const handleDownload = () => {
    // Get the original image URL without any transformations
    const originalImageUrl = `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}${blok.image}`;

    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = originalImageUrl;
    link.download = `${story.name}.png`; // Add .png extension for better UX

    // Optional: Open in new tab as fallback for browsers that don't support download
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFavorite = () => {
    // TODO: Implement favorite functionality
    console.log('Favorite clicked');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share clicked');
  };

  return (
    <Container
      {...storyblokEditable(blok)}
      maxWidth="lg"
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 4,
        }}
      >
        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            {blok.image && (
              <Image
                src={blok.image}
                alt={blok.title}
                width={528}
                priority
              />
            )}
          </Grid>

          {/* Details Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%'
            }}>
              <Typography variant="h4" component="h1">
                {blok.title}
              </Typography>
              <Divider />
              <Typography variant="body1" color="text.secondary">
                {blok.title} printable coloring page plus {relatedPages.length} free {getCategoryFromSlug(story.full_slug)} coloring pages, from easy to advanced. Perfect for kids and adults - download, print, and start coloring now!
              </Typography>

              <Divider />

              {/* <Box sx={{
                  display: 'flex',
                  gap: 1,
                }}>
                  {user && (
                    <Button
                      variant="outlined"
                      startIcon={<FavoriteBorderIcon />}
                      onClick={handleFavorite}
                      fullWidth
                    >
                      Save to Favorites
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                    fullWidth
                  >
                    Share
                  </Button>
                </Box> */}
              <Box sx={{
                display: 'flex',
                gap: 1,
              }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  disableElevation
                >
                  Download
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Loader message="Loading coloring pages..." />
      ) : (
        <Grid container spacing={2}>
          {relatedPages.map((page) => (
            <Grid key={page.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Link href={`/${page.full_slug.replace('categories/', '').replace('/pages', '')}`}>
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
                  {page.content?.image && (
                    <Image
                      src={page.content.image}
                      alt={page.name}
                    />
                  )}
                  <Typography variant="h5">
                    {page.name}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PageDetail;

