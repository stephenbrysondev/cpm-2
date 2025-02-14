'use client';

import useSWR from 'swr';
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import Image from '../Image';
import DownloadIcon from '@mui/icons-material/Download';

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
  // Get the category more reliably
  const category = story.full_slug
    .split('/')
    .filter(segment => segment !== 'pages' && segment !== 'coloring-pages' && segment !== 'categories')[0];

  const { data, error, isValidating } = useSWR(
    category ? `/api/search?category=${encodeURIComponent(category)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => console.error('SWR Error:', err)
    }
  );

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

  return (
    <Container
      maxWidth="lg"
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2
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
              height: '100%'
            }}>
              <Typography variant="h4" component="h1">
                {blok.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {blok.title} printable coloring page plus {relatedPages.length} free {getCategoryFromSlug(story.full_slug)} coloring pages, from easy to advanced. Perfect for kids and adults - download, print, and start coloring now!
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
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {data && (
        <Grid container spacing={2}>
          {data.map((page) => (
            <Grid key={page.id} item size={{ xs: 12, sm: 6, md: 4 }}>
              <Link href={`/${page.full_slug.replace('/categories', '').replace('/pages', '')}`}>
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
                    <Image src={page.content.image} alt={page.name} />
                  )}
                  <Box>
                    <Typography variant="h5">{page.name}</Typography>
                  </Box>
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

