'use client';

import styled from 'styled-components';

var MaxWidthWrapper = styled.div`
	position: relative;
	margin-left: auto;
	margin-right: auto;
	padding-left: 16px;
	padding-right: 16px;
	width: min(100%, 800px);
	height: 100%;
	max-width: 100dvw;
`;

export default MaxWidthWrapper;
