import type { Metadata } from 'next';

import StyledComponentsRegistry from '@/components/StyledComponentsRegistry';
import { roboto, inter } from '@/helpers/getFont';
import GlobalStyles from '@/components/GlobalStyles';

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
					{children}
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
