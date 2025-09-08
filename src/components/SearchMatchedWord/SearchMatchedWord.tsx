'use client';

import * as React from 'react';
import styled from 'styled-components';

function SearchMatchedWord({ children }: { children: React.ReactNode }) {
	return <Wrapper>{children}</Wrapper>;
}

export default SearchMatchedWord;

var Wrapper = styled.span`
	font-weight: 700;
	color: var(--text-status-mark);
`;
