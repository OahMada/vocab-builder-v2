'use client';

import styled from 'styled-components';

var Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100dvh;
	text-align: center;
`;

var NotFoundTitle = styled.h2`
	font-weight: 500;
	font-size: 1.2rem;
`;

export { Wrapper, NotFoundTitle };
