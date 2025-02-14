import { getStoryblokApi } from "@storyblok/react";

export default async function handler(req, res) {
    const { path, q } = req.query;

    if (!path && !q) {
        return res.status(400).json({ error: 'Path or search query parameter is required' });
    }

    try {
        const storyblokApi = getStoryblokApi();

        // If we have a path, get pages under that category
        if (path) {
            const cleanPath = path.replace(/\/$/, '');
            const { data } = await storyblokApi.get('cdn/stories', {
                version: 'draft',
                starts_with: cleanPath,
                per_page: 100,
                sort_by: 'name:asc'
            });

            // Filter to only include pages, not the category itself
            const pages = data.stories.filter(story => story.full_slug.includes('/pages/'));
            return res.status(200).json(pages);
        }

        // If we have a search query, search categories
        if (q) {
            const { data } = await storyblokApi.get('cdn/stories', {
                version: 'draft',
                starts_with: 'coloring-pages/categories',
                excluding_slugs: 'coloring-pages/categories/*/pages/*',
                search_term: q,
                per_page: 100,
                sort_by: 'name:asc'
            });

            return res.status(200).json(data.stories);
        }
    } catch (error) {
        console.error('[API] Search error:', error?.response?.data || error);
        return res.status(500).json({ error: 'Failed to fetch pages' });
    }
}
