'use client';

import styled from 'styled-components';

var LayoutWrapper = styled.div`
	min-height: 100dvh;
	isolation: isolate;

	display: grid;
	grid-template-rows: 3rem 1fr 3rem;

	max-width: min(100%, 800px);
	margin-left: auto;
	margin-right: auto;
	padding-left: 16px;
	padding-right: 16px;
`;

export default LayoutWrapper;
