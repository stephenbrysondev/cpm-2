import {
    useStoryblokState,
    getStoryblokApi,
    StoryblokComponent,
} from "@storyblok/react";
import { useRouter } from 'next/router';

export default function Page({ story, pages = [], relatedPages = [] }) {
    const router = useRouter();
    story = useStoryblokState(story);

    // If no story was found, redirect to 404
    if (!story) {
        if (typeof window !== 'undefined') {
            router.push('/404');
        }
        return null;
    }

    return (
        <div>
            <StoryblokComponent
                blok={story.content}
                story={story}
                pages={pages}
                relatedPages={relatedPages}
            />
        </div>
    );
}

export async function getStaticProps({ params }) {
    try {
        const storyblokApi = getStoryblokApi();
        let slug = params.slug.join('/');
        const fullSlug = addOrganizationalFolders(slug);

        // Fetch story and additional content in parallel
        const [storyRes, additionalRes] = await Promise.all([
            storyblokApi.get(`cdn/stories/${fullSlug}`, {
                version: "draft",
            }),
            // Fetch different content based on page type
            fullSlug.includes('/pages/')
                ? // For detail pages, fetch related pages
                storyblokApi.get('cdn/stories', {
                    version: "draft",
                    starts_with: `${fullSlug.split('/pages/')[0]}/pages/`,
                    excluding_slugs: fullSlug,
                    per_page: 100,
                    resolve_relations: 'none',
                    resolve_links: 'none'
                })
                : // For category pages, fetch category pages
                storyblokApi.get('cdn/stories', {
                    version: "draft",
                    starts_with: `${fullSlug}/pages/`,
                    per_page: 100,
                    resolve_relations: 'none',
                    resolve_links: 'none'
                })
        ]);

        // Determine if this is a detail page or category page
        const isDetailPage = fullSlug.includes('/pages/');

        return {
            props: {
                story: storyRes.data.story,
                // Pass data to appropriate prop based on page type
                ...(isDetailPage
                    ? { relatedPages: additionalRes.data.stories }
                    : { pages: additionalRes.data.stories }
                ),
            },
            revalidate: 3600,
        };
    } catch (error) {
        console.error('Error fetching story:', error);
        return {
            props: {
                story: false,
                pages: [],
                relatedPages: [],
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
        const link = links[linkKey];

        // Skip folders and empty slugs
        if (link.is_folder || !link.slug) {
            return;
        }

        // Skip the 404 page and home page
        if (link.slug === '404' || link.slug === 'home') {
            return;
        }

        // Skip organizational folders themselves
        if (link.slug === 'categories' || link.slug === 'pages') {
            return;
        }

        // Remove organizational folders from the URL
        const cleanSlug = removeOrganizationalFolders(link.slug);

        // Split and create path params
        const splittedSlug = cleanSlug.split("/");
        paths.push({ params: { slug: splittedSlug } });

    });


    return {
        paths: paths,
        // Use blocking to handle paths not generated at build time
        fallback: 'blocking',
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
    const cleanSlug = cleanedSegments.join("/");

    return cleanSlug;
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