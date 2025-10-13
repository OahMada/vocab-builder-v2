import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SessionProvider } from 'next-auth/react';

import { roboto, inter } from '@/lib/getFont';
import { LIGHT_COLORS, DARK_COLORS } from '@/constants';
import getCookie from '@/lib/getCookie';

import StyledComponentsRegistry from '@/components/StyledComponentsRegistry';
import GlobalStyles from '@/components/GlobalStyles';
import GlobalToastProvider from '@/components/GlobalToastProvider';

export var metadata: Metadata = {
	title: 'Vocab Builder',
	description: 'A tool for building your vocabulary while learning a foreign language.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let savedTheme = await getCookie('color-theme');
	let theme = savedTheme || 'dark';
	let themeColors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

	return (
		<html lang='en' className={`${roboto.className} ${inter.className}`} data-theme={theme} style={themeColors as React.CSSProperties}>
			<body>
				<StyledComponentsRegistry>
					<GlobalStyles />
					<SessionProvider>
						<NuqsAdapter>
							<GlobalToastProvider>{children}</GlobalToastProvider>
						</NuqsAdapter>
					</SessionProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
