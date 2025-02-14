import { storyblokEditable } from "@storyblok/react";
import { Container, Typography, Paper, Chip, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import Image from '../Image';

const getTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim());
};

const PageCategory = ({ blok, story, pages = [] }) => {
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
        <Typography variant="h2" component="h1">{blok.title}</Typography>
        <Typography variant="body1">
          Check out these <b>{blok.title}</b> coloring pages! We have a selection of <b>{pages.length}</b> coloring pages for you to choose from.
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

      <Grid container spacing={2}>
        {pages.map((page, index) => (
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
                    priority={index < 3}
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
    </Container>
  );
};

export default PageCategory;
