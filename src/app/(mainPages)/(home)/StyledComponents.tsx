'use client';

import styled from 'styled-components';

import Button from '@/components/Button';

export var Title = styled.h1`
	font-size: ${24 / 16}rem;
	font-weight: 600;
	margin-top: -48px;
`;

export var BrowseButton = styled(Button)`
	@media (hover: hover) {
		&:hover {
			text-decoration: none;
		}
	}
`;
