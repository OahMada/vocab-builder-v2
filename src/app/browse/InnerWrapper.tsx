'use client';

import styled from 'styled-components';

var InnerWrapper = styled.div`
	position: sticky;
	top: 3rem;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;
	background-color: var(--bg-primary);
	box-shadow: var(--shadow-elevation-medium);

	/* nullish the PageWrapper top padding */
	margin-top: -8px;
	padding-top: 8px;

	/* turn the parent flex gap into padding */
	padding-bottom: 12px;
	margin-bottom: -12px;
	z-index: 9;
`;

export default InnerWrapper;
