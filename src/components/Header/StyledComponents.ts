'use client';

import styled from 'styled-components';

import { QUERIES } from '@/constants';

export var Wrapper = styled.div`
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	background-color: var(--bg-primary);
	z-index: 10;
`;

export var StyledHeader = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	gap: 5px;
`;

export var HeaderNav = styled.nav`
	flex: 1;
	align-items: center;
	gap: 20px;
	font-size: ${12 / 16}rem;
	justify-content: center;
	display: none;

	@media ${QUERIES.tabletAndUp} {
		display: flex;
	}
`;

export var InnerWrapper = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 5px;
`;
