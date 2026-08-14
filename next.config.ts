import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
            bodySizeLimit: '5mb',
        },
        cpus: 2,
    },
};

export default nextConfig;
