'use client';

import styled from 'styled-components';

var Wrapper = styled.main<{ $position?: 'flex-start' | 'center' }>`
	display: flex;
	flex-direction: column;
	justify-content: ${({ $position }) => $position || 'center'};
	align-items: center;
	gap: 12px;
	height: 100%;
`;

export default Wrapper;
