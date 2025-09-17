'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useTimeout, useInterval } from '@/hooks';
import { useRouter } from 'next/navigation';
import NavLink from '@/components/NavLink';

var RedirectUrlMap = {
	'/': {
		pageName: 'home page',
		linkText: 'return home',
	},
	'/auth/login': {
		pageName: 'login page',
		linkText: 'login',
	},
} as const;

type RedirectUrl = keyof typeof RedirectUrlMap;

function Redirect({ redirectUrl }: { redirectUrl: RedirectUrl }) {
	let [countDown, setCountDown] = React.useState(3);
	let router = useRouter();

	let { linkText, pageName } = RedirectUrlMap[redirectUrl];

	let intervalId = useInterval(
		() => {
			setCountDown(countDown - 1);
		},
		countDown < 1 ? null : 1000
	);

	let timeoutId = useTimeout(() => {
		router.push(redirectUrl);
	}, 3000);

	function clearTimeoutAndInterval() {
		if (typeof intervalId.current === 'number') clearInterval(intervalId.current);
		if (typeof timeoutId.current === 'number') clearTimeout(timeoutId.current);
	}

	return (
		<RedirectWrapper>
			You&apos;ll be redirected to {pageName} in {countDown}s. Or you can click{' '}
			<ReturnLink href={redirectUrl} onClick={clearTimeoutAndInterval}>
				{linkText}
			</ReturnLink>
			.
		</RedirectWrapper>
	);
}

export default Redirect;

var RedirectWrapper = styled.p`
	color: var(--text-tertiary);
`;

var ReturnLink = styled(NavLink)`
	text-decoration: underline;
`;

export var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	text-align: center;
`;

export var RedirectTitle = styled.h2`
	font-weight: 500;
	font-size: 1.2rem;
`;
