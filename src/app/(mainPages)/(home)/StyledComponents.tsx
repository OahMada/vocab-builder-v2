'use client';

import Button from '@/components/Button';
import styled from 'styled-components';

export var Title = styled.h1`
	font-size: ${24 / 16}rem;
	font-weight: 600;
`;

export var BrowseButton = styled(Button)`
	@media (hover: hover) {
		&:hover {
			text-decoration: none;
		}
	}
`;
