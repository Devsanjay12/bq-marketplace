/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
            },
            {
                protocol: 'https',
                hostname: 'www.redditstatic.com',
            },
            {
                protocol: 'https',
                hostname: 'styles.redditmedia.com',
            },
            {
                protocol: 'https',
                hostname: 'external-preview.redd.it',
            },
            {
                protocol: 'https',
                hostname: 'duckduckgo.com',
            },
            {
                protocol: 'https',
                hostname: 'icons.duckduckgo.com',
            },
            {
                protocol: 'https',
                hostname: 'julius.ai',
            },
            {
                protocol: 'https',
                hostname: 'assets-global.website-files.com',
            },
            {
                protocol: 'https',
                hostname: 'www.tabnine.com',
            }
        ],
    },
};

export default nextConfig;
