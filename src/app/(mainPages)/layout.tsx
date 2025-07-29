import type { Metadata } from 'next';

import StyledComponentsRegistry from '@/components/StyledComponentsRegistry';
import { roboto, inter } from '@/helpers/getFont';
import GlobalStyles from '@/components/GlobalStyles';
import LayoutWrapper from './LayoutWrapper';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export var metadata: Metadata = {
	title: 'Vocab Builder',
	description: 'A tool for building your vocabulary while learning a foreign language.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={`${roboto.className} ${inter.className}`}>
			<body>
				<StyledComponentsRegistry>
					<GlobalStyles />
					<LayoutWrapper>
						<Header />
						{children}
						<Footer />
					</LayoutWrapper>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
