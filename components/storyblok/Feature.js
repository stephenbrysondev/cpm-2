import { storyblokEditable } from "@storyblok/react";

const Feature = ({ blok }) => (
  <div {...storyblokEditable(blok)}>
    {blok.name}
  </div>
);

export default Feature;
