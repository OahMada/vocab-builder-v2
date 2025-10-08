'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';

var NavLink = styled(Link)<{ $underScored?: boolean }>`
	color: inherit;

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
