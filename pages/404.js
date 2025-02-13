import { getStoryblokApi, StoryblokComponent } from "@storyblok/react";
import { useEffect, useState } from "react";
import Loader from '../components/Loader';

export default function Custom404() {
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNotFoundPage = async () => {
            try {
                const storyblokApi = getStoryblokApi();
                const { data } = await storyblokApi.get('cdn/stories', {
                    version: 'draft',
                    starts_with: '404',
                });

                // Get the first story from the array
                if (data.stories && data.stories.length > 0) {
                    setStory(data.stories[0]);
                }
            } catch (error) {
                console.error('Error fetching 404 page:', error);
                console.log('Error details:', {
                    message: error.message,
                    response: error.response?.data
                });
            } finally {
                setLoading(false);
            }
        };

        getNotFoundPage();
    }, []);

    if (loading) return <Loader message="Loading..." />;
    if (!story) return <div>Page not found</div>;

    return <StoryblokComponent blok={story.content} story={story} />;
}