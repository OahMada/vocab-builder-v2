'use client';

import styled from 'styled-components';

import Loading from '@/components/Loading';

export var ChildrenWrapper = styled.div`
	position: sticky;
	top: 4rem;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;
	background-color: var(--bg-primary);
	box-shadow: var(--shadow-elevation-low);

	/* turn the parent flex gap into padding */
	padding-bottom: 12px;
	margin-bottom: -12px;
	z-index: 9;
`;

export var LoadingWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export var LoadingInnerWrapper = styled.div`
	height: 100%;
	position: relative;
	background-color: var(--bg-primary-hover);
	border-radius: 12px;
`;

export var LoadingSpinner = styled(Loading)`
	position: absolute;
	right: 16px;
	bottom: 16px;
`;
