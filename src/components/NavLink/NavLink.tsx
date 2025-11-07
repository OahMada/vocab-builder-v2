'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';

var NavLink = styled(Link)<{ $underScored?: boolean }>`
	color: inherit;
	text-underline-offset: 4px;

	${({ $underScored = false }) =>
		!$underScored &&
		css`
			text-decoration: none;
			@media (hover: hover) {
				&:hover {
					text-decoration: revert;
				}
			}
		`}
`;

export default NavLink;
