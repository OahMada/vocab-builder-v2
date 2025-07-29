import LayoutWrapper from './LayoutWrapper';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <LayoutWrapper>{children}</LayoutWrapper>;
}
