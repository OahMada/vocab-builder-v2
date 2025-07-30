'use client';

import * as React from 'react';
import * as AvatarPrimitives from '@radix-ui/react-avatar';
import styled, { css } from 'styled-components';

function Avatar({
	src,
	fallbackStyle,
	...delegated
}: { src: string; fallbackStyle: 'fill' | 'outline' } & React.ComponentProps<typeof AvatarPrimitives.Root>) {
	return (
		<Root {...delegated}>
			{/* <Image src={src} alt='Adam Hao' /> */}
			<Image src='#' alt='Adam Hao' />
			<Fallback delayMs={400} $style={fallbackStyle}>
				AH
			</Fallback>
		</Root>
	);
}

export default Avatar;

var Root = styled(AvatarPrimitives.Root)`
	--avatar-size: 100px;
	--fallback-font-size: 2rem;

	/* to keep a circular shape */
	overflow: hidden;
	width: var(--avatar-size);
	height: var(--avatar-size);
	border-radius: 100%;
	display: block;
	border: 1px solid var(--border-medium);
`;

var Image = styled(AvatarPrimitives.Image)`
	object-fit: cover;
	width: 100%;
	height: 100%;
	border-radius: 100%;
`;

var Fallback = styled(AvatarPrimitives.Fallback)<{ $style: 'fill' | 'outline' }>`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: var(--fallback-font-size);
	user-select: none;

	${({ $style }) => {
		if ($style === 'fill') {
			return css`
				background-color: var(--bg-tertiary);
			`;
		} else if ($style === 'outline') {
			return css`
				background-color: transparent;
			`;
		}
	}}
	font-weight: 500;
`;
