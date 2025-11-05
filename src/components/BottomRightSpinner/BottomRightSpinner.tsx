'use client';
import * as React from 'react';
import styled from 'styled-components';

import { QUERIES } from '@/constants';

import Loading from '@/components/Loading';

function BottomRightSpinner({ ...delegated }: Omit<React.ComponentProps<typeof Loading>, 'size' | 'strokeWidth'>) {
	return <ModalLoadingFallback size={24} strokeWidth={2} {...delegated} />;
}

export var ModalLoadingFallback = styled(Loading)`
	position: fixed;
	right: 16px;
	bottom: 70px;

	@media ${QUERIES.tabletAndUp} {
		bottom: 16px;
	}
	color: var(--text-tertiary);
`;

export default BottomRightSpinner;
