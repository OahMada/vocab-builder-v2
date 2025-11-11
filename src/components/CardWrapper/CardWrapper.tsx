'use client';

import { m } from 'motion/react';
import styled from 'styled-components';

var CardWrapper = styled(m.div)`
	background-color: var(--bg-secondary);
	width: 100%;
	padding: 14px;
	border-radius: 24px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	box-shadow: var(--shadow-elevation-low);
	isolation: isolate;
`;

export default CardWrapper;
