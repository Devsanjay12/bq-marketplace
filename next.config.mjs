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
                hostname: 'tempfile.aiquickdraw.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'images.seeklogo.com',
            },
            {
                protocol: 'https',
                hostname: 'replit.com',
            },
            {
                protocol: 'https',
                hostname: 'www.notion.so',
            },
            {
                protocol: 'https',
                hostname: 'runwayml.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.openai.com',
            },
            {
                protocol: 'https',
                hostname: 'framerusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com',
            },
            {
                protocol: 'https',
                hostname: 'yt3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'logowik.com',
            }
        ],
    },
};

export default nextConfig;
