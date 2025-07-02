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
};

export default bundleAnalyzer(nextConfig);
