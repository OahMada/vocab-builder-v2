'use client';

import styled from 'styled-components';

var Wrapper = styled.div`
	color: var(--text-primary);
	display: grid;
	place-items: center;
	min-height: 100dvh;
`;

var InnerWrapper = styled.div``;

var NotFoundTitle = styled.h2`
	font-weight: 450;
	font-size: 1.2rem;
`;

export { Wrapper, InnerWrapper, NotFoundTitle };
