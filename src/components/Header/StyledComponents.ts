'use client';

import styled from 'styled-components';

import { QUERIES } from '@/constants';

import Button from '@/components/Button';

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
`;

export var LoginButton = styled(Button)`
	--bg-color: var(--bg-revert);
	--hover-bg-color: var(--bg-revert-hover);
	--text-color: var(--text-revert);
	border-radius: 24px;
	font-size: ${14 / 16}rem;
	font-weight: 500;
	margin-left: auto;
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
