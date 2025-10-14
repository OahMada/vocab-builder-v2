'use client';
import * as React from 'react';
import styled from 'styled-components';

import Loading from '@/components/Loading';

function BottomRightSpinner({ ...delegated }: Omit<React.ComponentProps<typeof Loading>, 'size' | 'strokeWidth'>) {
	return <ModalLoadingFallback size={24} strokeWidth={2} {...delegated} />;
}

export var ModalLoadingFallback = styled(Loading)`
	position: fixed;
	right: 16px;
	/* 4rem is the height of footer */
	bottom: 16px;
`;

export default BottomRightSpinner;
