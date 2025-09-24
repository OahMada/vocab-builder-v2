'use client';

import * as React from 'react';
import * as AvatarPrimitives from '@radix-ui/react-avatar';
import styled, { css } from 'styled-components';
import { useSession } from 'next-auth/react';

import { getNameInitials } from '@/helpers';

function Avatar({ fallbackStyle, ...delegated }: { fallbackStyle: 'fill' | 'outline' } & React.ComponentProps<typeof AvatarPrimitives.Root>) {
	let { data: session } = useSession();
	let [nameInitials, setNameInitials] = React.useState<string | undefined>(undefined);

	React.useEffect(() => {
		if (session?.user.name) {
			let initials = getNameInitials(session.user.name);
			setNameInitials(initials);
		}
	}, [session?.user.name]);
	return (
		<Root {...delegated}>
			<Image src={session?.user.image || '#'} alt={session?.user.name || undefined} />
			<Fallback delayMs={400} $style={fallbackStyle}>
				{nameInitials}
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
	border: 1px solid var(--border-light);
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
