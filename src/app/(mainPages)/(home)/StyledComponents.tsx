'use client';

import styled from 'styled-components';

import { QUERIES } from '@/constants';

import Button from '@/components/Button';

export var Title = styled.h1`
	font-size: ${24 / 16}rem;
	font-weight: 600;

	@media ${QUERIES.tabletAndUp} {
		font-size: ${36 / 16}rem;
	}
	align-self: end;
`;

export var BrowseButton = styled(Button)`
	@media (hover: hover) {
		&:hover {
			text-decoration: none;
		}
	}
`;

export var InnerWrapper = styled.div`
	display: grid;
	grid-template-rows: repeat(3, 1fr);
	height: 100%;
	width: 100%;
	justify-items: center;
	align-items: center;
	gap: 12px;
`;

export var GroupWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
`;
