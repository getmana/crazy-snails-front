import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/uk',
                permanent: true,
            },
        ];
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        icon: true,
                        titleProp: true,
                    },
                },
            ],
        });

        return config;
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;
