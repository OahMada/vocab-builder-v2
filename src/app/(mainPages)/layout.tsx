import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LayoutWrapper from './LayoutWrapper';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<LayoutWrapper>
			<Header />
			{children}
			<Footer />
		</LayoutWrapper>
	);
}
