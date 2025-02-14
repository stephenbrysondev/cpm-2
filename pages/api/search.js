import { getStoryblokApi } from "@storyblok/react";

export default async function handler(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get('cdn/stories', {
            version: 'draft',
            starts_with: 'coloring-pages/categories/',
            excluding_slugs: 'coloring-pages/categories/*/pages/*',
            per_page: 20,
            search_term: q,
            resolve_relations: 'none',
            resolve_links: 'none',
        });

        // Add caching headers
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

        return res.status(200).json(data.stories);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Failed to search pages' });
    }
} 