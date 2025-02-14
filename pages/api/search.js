import { getStoryblokApi } from "@storyblok/react";

export default async function handler(req, res) {
    const { q, category } = req.query;

    if (!q && !category) {
        return res.status(400).json({ error: 'Query or category parameter is required' });
    }

    try {
        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get('cdn/stories', {
            version: 'draft',
            starts_with: category
                ? `coloring-pages/categories/${category}/pages/`  // Fetch only pages under the category
                : 'coloring-pages/categories/',
            is_startpage: category ? 0 : 1,
            per_page: 20,
            search_term: q || "",
            resolve_relations: 'none',
            resolve_links: 'none',
        });

        console.log('debug', category, data);

        // Add caching headers
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

        return res.status(200).json(data.stories);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Failed to fetch pages' });
    }
}