import { getStoryblokApi } from "@storyblok/react";

export default async function handler(req, res) {
    const { path, q } = req.query;

    if (!path && q === undefined) {
        return res.status(400).json({ error: 'Path or search query parameter is required' });
    }

    try {
        const storyblokApi = getStoryblokApi();

        // If we have a path, get pages under that folder
        if (path) {
            const cleanPath = path.replace(/\/$/, '');
            const { data } = await storyblokApi.get('cdn/stories', {
                version: 'draft',
                is_startpage: false,
                starts_with: cleanPath,
                per_page: 100,
                sort_by: 'name:asc'
            });

            // Return all stories except the folder itself
            const pages = data.stories.filter(story => story.full_slug !== cleanPath);
            return res.status(200).json(pages);
        }

        // Search all coloring pages (or return all if no search term)
        const { data } = await storyblokApi.get('cdn/stories', {
            version: 'draft',
            starts_with: 'coloring-pages',
            excluding_slugs: 'coloring-pages/',
            search_term: q || "",
            is_startpage: true,
            per_page: 100,
            sort_by: 'name:asc'
        });

        return res.status(200).json(data.stories);
    } catch (error) {
        console.error('[API] Search error:', error?.response?.data || error);
        return res.status(500).json({ error: 'Failed to fetch pages' });
    }
}
