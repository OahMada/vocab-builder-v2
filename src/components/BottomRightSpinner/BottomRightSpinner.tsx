'use client';
import * as React from 'react';
import styled from 'styled-components';

import Loading from '@/components/Loading';
import { QUERIES } from '@/constants';

function BottomRightSpinner({ ...delegated }: Omit<React.ComponentProps<typeof Loading>, 'size' | 'strokeWidth'>) {
	return <ModalLoadingFallback size={24} strokeWidth={2} {...delegated} />;
}

export var ModalLoadingFallback = styled(Loading)`
	position: fixed;
	right: 16px;
	/* 4rem is the height of footer */
	bottom: calc(16px + 4rem);

	@media ${QUERIES.tabletAndUp} {
		right: calc(16px + 4rem);
	}
`;

export default BottomRightSpinner;
