import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { Container } from "@mui/material";
const Page = ({ blok }) => (
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
    {blok.body && blok.body.map((nestedBlok) => (
      <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
    ))}
  </Container>
);

export default Page;
