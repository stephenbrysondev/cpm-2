import { getStoryblokApi } from "@storyblok/react";

export default async function handler(req, res) {
    const { q, category } = req.query;

    console.log('[API] Search params:', { q, category });

    if (!q && !category) {
        console.log('[API] Missing required params');
        return res.status(400).json({ error: 'Query or category parameter is required' });
    }

    try {
        const storyblokApi = getStoryblokApi();

        const queryParams = category ? {
            starts_with: `coloring-pages/categories/${category}/pages/`,
            version: 'draft',
            is_startpage: 0,
            per_page: 100,
            resolve_relations: 'none',
            resolve_links: 'none',
        } : {
            starts_with: 'coloring-pages/categories/',
            version: 'draft',
            is_startpage: 1,
            per_page: 100,
            search_term: q,
            resolve_relations: 'none',
            resolve_links: 'none',
        };

        console.log('[API] Query params:', queryParams);

        const { data } = await storyblokApi.get('cdn/stories', queryParams);
        console.log('[API] Response:', {
            storiesCount: data.stories.length,
            firstStory: data.stories[0]?.full_slug
        });

        // Add caching headers
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

        return res.status(200).json(data.stories);
    } catch (error) {
        console.error('[API] Search error:', error?.response?.data || error);
        return res.status(500).json({ error: 'Failed to fetch pages' });
    }
}