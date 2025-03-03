import {
    useStoryblokState,
    getStoryblokApi,
    StoryblokComponent,
} from "@storyblok/react";
import { useRouter } from 'next/router';

export default function Page({ story: initialStory }) {
    const router = useRouter();
    const story = useStoryblokState(initialStory);

    // If no story was found, redirect to 404
    if (!story) {
        if (typeof window !== 'undefined') {
            router.push('/404');
        }
        return null;
    }

    return (
        <div>
            <StoryblokComponent blok={story.content} story={story} />
        </div>
    );
}

export async function getStaticProps({ params }) {
    try {
        const storyblokApi = getStoryblokApi();
        let slug = params.slug.join('/');

        const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
            version: "draft",
        });

        return {
            props: {
                story: data ? data.story : false,
            },
            revalidate: 3600,
        };
    } catch (error) {
        console.error('Error fetching story:', error);
        return {
            props: {
                story: false,
            },
            revalidate: 3600,
        };
    }
}

export async function getStaticPaths() {
    const storyblokApi = getStoryblokApi();
    let { data } = await storyblokApi.get("cdn/links/", {
        version: 'draft'
    });

    let paths = [];
    const links = data.links;

    Object.keys(links).forEach((linkKey) => {
        if (links[linkKey].is_folder || !links[linkKey].slug) {
            return;
        }

        // Skip the 404 page and home page
        if (links[linkKey].slug === '404' || links[linkKey].slug === 'home') {
            return;
        }

        const splittedSlug = links[linkKey].slug.split("/");
        paths.push({ params: { slug: splittedSlug } });
    });

    return {
        paths: paths,
        fallback: 'blocking',
    };
}