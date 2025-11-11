'use client';
import styled, { keyframes } from 'styled-components';

var shimmer = keyframes`
	0% {
		background-position: 0% 0;
	}
	100% {
		background-position: 100% 0;
	}
`;

var PricePlaceHolder = styled.span`
	width: var(--width);
	height: var(--height);
	border-radius: 12px;

	background-image: var(--loading-background-image);
	background-size: 400% 100%;
	background-repeat: no-repeat;
	animation: ${shimmer} 700ms ease-in-out infinite alternate;
`;
export default PricePlaceHolder;
