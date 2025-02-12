/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            process.env.NEXT_PUBLIC_CLOUDFLARE_URL
        ],
    },
}

module.exports = nextConfig 