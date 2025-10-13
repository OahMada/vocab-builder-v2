import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

var bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
	/* config options here */
	compiler: {
		styledComponents: true,
	},
	experimental: {
		typedEnv: true,
	},
	transpilePackages: ['next-mdx-remote'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'vbprojectstorage.blob.core.windows.net',
				pathname: '/image/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
		],
	},
};

export default bundleAnalyzer(nextConfig);
