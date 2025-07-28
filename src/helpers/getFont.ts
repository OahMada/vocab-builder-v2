import localFont from 'next/font/local';

const roboto = localFont({
	src: [
		{
			path: '../../public/font/Roboto.woff2',
			weight: '300 1000',
			style: 'normal',
		},
		{
			path: '../../public/font/Roboto-italic.woff2',
			weight: '300 1000',
			style: 'italic',
		},
	],
	display: 'fallback',
});

const inter = localFont({
	src: '../../public/font/Inter.woff2',
	display: 'fallback',
	weight: '300 1000',
	style: 'normal',
});

export { roboto, inter };
