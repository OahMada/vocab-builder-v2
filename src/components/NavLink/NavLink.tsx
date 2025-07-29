'use client';

import styled from 'styled-components';
import Link from 'next/link';

var NavLink = styled(Link)`
	color: inherit;
	text-decoration: none;

	@media (hover: hover) {
		&:hover {
			text-decoration: revert;
		}
	}
`;

export default NavLink;
