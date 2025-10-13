'use client';

import styled from 'styled-components';

import { QUERIES } from '@/constants';

import Button from '@/components/Button';

export var Title = styled.h1`
	font-size: ${24 / 16}rem;
	font-weight: 600;
	margin-bottom: 48px;
	margin-top: -56px;

	@media ${QUERIES.tabletAndUp} {
		font-size: ${36 / 16}rem;
	}
`;

export var BrowseButton = styled(Button)`
	@media (hover: hover) {
		&:hover {
			text-decoration: none;
		}
	}
`;
