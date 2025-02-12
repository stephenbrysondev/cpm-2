import { storyblokEditable } from "@storyblok/react";
import { Paper, Typography } from "@mui/material";

const Hero = ({ blok }) => {
  return <Paper {...storyblokEditable(blok)}
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
    <Typography variant="body1">{blok.description}</Typography>
  </Paper>;
};

export default Hero;
