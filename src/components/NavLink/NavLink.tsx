'use client';

import styled from 'styled-components';
import Link from 'next/link';

var NavLink = styled(Link)`
	text-decoration: none;
	color: inherit;

	@media (hover: hover) {
		&:hover {
			text-decoration: revert;
		}
	}
`;

export default NavLink;
