'use client';

import styled from 'styled-components';

var CardWrapper = styled.div`
	background-color: var(--bg-secondary);
	color: var(--text-primary);
	width: 100%;
	padding: 16px;
	border-radius: 24px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	box-shadow: var(--shadow-elevation-low);
	isolation: isolate;
`;

export default CardWrapper;
