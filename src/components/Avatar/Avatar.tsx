'use client';

import * as React from 'react';
import * as AvatarPrimitives from '@radix-ui/react-avatar';
import styled from 'styled-components';

function Avatar({ src }: { src: string }) {
	return (
		<Root>
			<Image src={src} alt='Adam Hao' />
			{/* <Image src='#' alt='Adam Hao' /> */}
			<Fallback delayMs={100}>AH</Fallback>
		</Root>
	);
}

export default Avatar;

var Root = styled(AvatarPrimitives.Root)`
	/* to keep a circular shape */
	overflow: hidden;
	width: 100%;
	height: 100%;
	border-radius: inherit;
	display: block;
`;

var Image = styled(AvatarPrimitives.Image)`
	object-fit: cover;
	width: 100%;
	height: 100%;
`;

var Fallback = styled(AvatarPrimitives.Fallback)`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text-primary);
	font-size: 2rem;
	background-color: var(--bg-tertiary);
	font-weight: 500;
`;
