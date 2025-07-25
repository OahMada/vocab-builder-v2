import localFont from 'next/font/local';

const roboto = localFont({
	src: [
		{
			path: '../../public/font/roboto.woff2',
			weight: '300 1000',
			style: 'normal',
		},
		{
			path: '../../public/font/roboto-italic.woff2',
			weight: '300 1000',
			style: 'italic',
		},
	],
	display: 'fallback',
});

const gaMaamli = localFont({
	src: '../../public/font/ga-maamli.woff2',
	display: 'fallback',
	weight: '400',
	style: 'normal',
});

export { roboto, gaMaamli };
