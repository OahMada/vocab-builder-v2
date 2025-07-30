'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useTimeout, useInterval } from '@/hooks';
import { useRouter } from 'next/navigation';
import NavLink from '@/components/NavLink';

function NotFoundRedirect() {
	let [countDown, setCountDown] = React.useState(3);
	let router = useRouter();

	let intervalId = useInterval(
		() => {
			setCountDown(countDown - 1);
		},
		countDown < 1 ? null : 1000
	);

	let timeoutId = useTimeout(() => {
		router.push('/');
	}, 3000);

	function clearTimeoutAndInterval() {
		if (typeof intervalId.current === 'number') clearInterval(intervalId.current);
		if (typeof timeoutId.current === 'number') clearTimeout(timeoutId.current);
	}

	return (
		<Wrapper>
			You&apos;ll be redirected to home page in {countDown}s. Or you can click{' '}
			<ReturnLink href='/' onClick={clearTimeoutAndInterval}>
				return home
			</ReturnLink>
			.
		</Wrapper>
	);
}

export default NotFoundRedirect;

var Wrapper = styled.p`
	color: var(--text-tertiary);
`;

var ReturnLink = styled(NavLink)`
	text-decoration: underline;
`;
