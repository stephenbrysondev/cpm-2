import {
    useStoryblokState,
    getStoryblokApi,
    StoryblokComponent,
} from "@storyblok/react";

export default function Page({ story }) {
    story = useStoryblokState(story);

    return (
        <div>
            <StoryblokComponent blok={story.content} story={story} />
        </div>
    );
}

export async function getStaticProps({ params }) {
    let slug = params.slug ? params.slug.join("/") : "home";

    // Add back the organizational folders for Storyblok API
    slug = addOrganizationalFolders(slug);

    let sbParams = {
        version: "draft", // or 'published'
    };

    const storyblokApi = getStoryblokApi();
    let { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

    return {
        props: {
            story: data ? data.story : false,
            key: data ? data.story.id : false,
        },
        revalidate: 3600,
    };
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