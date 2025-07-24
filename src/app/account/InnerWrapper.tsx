'use client';

import styled from 'styled-components';

var InnerWrapper = styled.div`
	width: 100%;
	background-color: var(--bg-secondary);
	border-radius: 12px;
	color: var(--text-primary);
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding: 12px;
	box-shadow: var(--shadow-elevation-low);
	align-items: center;
`;

export default InnerWrapper;
