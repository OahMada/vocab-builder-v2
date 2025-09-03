'use client';

import styled from 'styled-components';

interface Parameters {
	axis: 'horizontal' | 'vertical';
	size: number;
}

type AtLeastOne<T, Keys extends keyof T = keyof T> = Partial<T> & { [K in Keys]-?: Required<Pick<T, K>> }[Keys];

type PartialParameters = AtLeastOne<Parameters>;

function getHeight({ axis, size }: PartialParameters) {
	return axis === 'horizontal' ? 1 : size;
}
function getWidth({ axis, size }: PartialParameters) {
	return axis === 'vertical' ? 1 : size;
}

var Spacer = styled.span<PartialParameters>`
	display: block;
	width: ${getWidth}px;
	min-width: ${getWidth}px;
	height: ${getHeight}px;
	min-height: ${getHeight}px;
`;

export default Spacer;
