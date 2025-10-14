'use client';

import styled from 'styled-components';

export var ChildrenWrapper = styled.div`
	position: sticky;
	top: 4rem;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;
	background-color: var(--bg-primary);

	/* turn the parent flex gap into padding */
	padding-bottom: 12px;
	margin-bottom: -12px;
	z-index: 10;
`;

export var LoadingWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export var LoadingFallback = styled.div`
	height: 100%;
	position: relative;
	background-color: var(--bg-primary-hover);
	border-radius: 12px;
	display: grid;
	place-items: center;
`;

export var LoadingText = styled.p`
	font-size: 0.8rem;
	font-weight: 350;
	color: var(--text-tertiary);
`;
