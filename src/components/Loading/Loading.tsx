'use client';

import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import Icon from '@/components/Icon';
import VisuallyHidden from '@/components/VisuallyHidden';

function Loading({ description, ...delegated }: { description: string; size?: number } & Omit<React.ComponentProps<typeof Icon>, 'id'>) {
	return (
		<>
			<LoadingIcon id='load' {...delegated} />
			<VisuallyHidden>{description}</VisuallyHidden>
		</>
	);
}

export default Loading;

var spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

var LoadingIcon = styled(Icon)`
	animation: ${spin} 2s linear infinite;
`;
