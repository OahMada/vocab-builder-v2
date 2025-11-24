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
	// https://github.com/resend/react-email/issues/2426#issuecomment-3568568145
	transpilePackages: ['next-mdx-remote', 'prettier'],
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
