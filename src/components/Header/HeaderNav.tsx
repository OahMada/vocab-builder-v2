'use client';

import * as React from 'react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';

import { QUERIES } from '@/constants';
import NavLink from '@/components/NavLink';

export default function HeaderNav() {
	let pathname = usePathname();

	return (
		<Wrapper>
			<HeaderNavLink href='/browse' $underScored={pathname === '/browse'}>
				Browse
			</HeaderNavLink>
			<HeaderNavLink href='/account' $underScored={pathname === '/account'}>
				Account
			</HeaderNavLink>
			<HeaderNavLink href='/pricing' $underScored={pathname === '/pricing'}>
				Pricing
			</HeaderNavLink>
			<HeaderNavLink href='/sync' $underScored={pathname === '/sync'} prefetch={true}>
				How to Sync
			</HeaderNavLink>
		</Wrapper>
	);
}

var Wrapper = styled.nav`
	flex: 1;
	align-items: center;
	gap: 5px;
	font-size: ${14 / 16}rem;
	justify-content: center;
	display: none;

	@media ${QUERIES.tabletAndUp} {
		display: flex;
	}
`;

var HeaderNavLink = styled(NavLink)`
	flex: 0 1 80px;
	text-align: center;
`;
