import type { Metadata } from 'next';

import StyledComponentsRegistry from '@/components/StyledComponentsRegistry';
import { roboto } from '@/helpers/getFont';
import GlobalStyles from '@/components/GlobalStyles';
import LayoutWrapper from './LayoutWrapper';

export const metadata: Metadata = {
	title: 'Vocab Builder',
	description: 'A tool for building your vocabulary when learning a foreign language',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={roboto.className}>
			<body>
				<StyledComponentsRegistry>
					<GlobalStyles />
					<LayoutWrapper>{children}</LayoutWrapper>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
