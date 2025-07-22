'use client';

import styled from 'styled-components';

var Wrapper = styled.main<{ $position?: 'flex-start' | 'center' }>`
	display: flex;
	flex-direction: column;
	justify-content: ${({ $position }) => $position || 'center'};
	align-items: center;
	gap: 12px;
	padding: 16px 0;
`;

export default Wrapper;
