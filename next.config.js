/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_CLOUDFLARE_URL,
                pathname: '/**',
            }
        ],
        loader: 'default',
        domains: ['cpm-2.netlify.app']
    },
}

module.exports = nextConfig 