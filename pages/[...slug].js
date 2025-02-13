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
        const { data } = await storyblokApi.get(`cdn/stories/${params.slug.join('/')}`, {
            version: "draft",
        });

        return {
            props: {
                story: data ? data.story : false,
            },
            revalidate: 3600,
        };
    } catch (error) {
        // If story is not found, return false for story prop
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

        // Remove organizational folders from the URL
        const cleanSlug = removeOrganizationalFolders(links[linkKey].slug);

        // Skip the home page
        if (cleanSlug === 'home') {
            return;
        }

        const splittedSlug = cleanSlug.split("/");
        paths.push({ params: { slug: splittedSlug } });
    });

    return {
        paths: paths,
        fallback: false,
    };
}

// Helper function to remove organizational folders from URLs
function removeOrganizationalFolders(slug) {
    // Split the path into segments
    const segments = slug.split("/");

    // Remove 'categories' and 'pages' from the path
    const cleanedSegments = segments.filter(segment =>
        segment !== "categories" &&
        segment !== "pages"
    );

    // Join the remaining segments back together
    return cleanedSegments.join("/");
}

// Helper function to add organizational folders back for Storyblok API
function addOrganizationalFolders(slug) {
    // Split the path into segments
    const segments = slug.split("/");

    // If we have a coloring page path
    if (segments[0] === "coloring-pages") {
        // If it's just /coloring-pages, return as is
        if (segments.length === 1) {
            return slug;
        }

        // Insert "categories" after "coloring-pages"
        segments.splice(1, 0, "categories");

        // If we have a specific page, add the "pages" folder before it
        if (segments.length > 3) {
            segments.splice(3, 0, "pages");
        }
    }

    return segments.join("/");
}