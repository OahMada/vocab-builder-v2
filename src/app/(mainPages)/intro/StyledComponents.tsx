'use client';

import styled from 'styled-components';

import { QUERIES } from '@/constants';

import Button from '@/components/Button';

export var Slogan = styled.h1`
	font-size: 48px;
	font-weight: 800;
	line-height: 1;
`;

export var SloganDescription = styled.p`
	font-size: 20px;
	color: var(--text-secondary);
`;
export var SloganWrapper = styled.section`
	margin-top: 48px;
	margin-bottom: 48px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 24px;

	@media ${QUERIES.tabletAndUp} {
		align-items: center;
		text-align: center;
		padding: 48px;
		margin-top: 150px;
		margin-bottom: 150px;
	}
`;

export var FeaturesWrapper = styled.section`
	padding: 24px;
	display: flex;
	gap: 60px;
	flex-direction: column;
	width: 100%;
`;

export var Feature = styled.article`
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: flex-start;
	min-height: 150px;
`;

export var FeatureTitle = styled.h2`
	font-size: 24px;
	line-height: 1;
	width: min-content;
`;

export var FeatureDesc = styled.p`
	color: var(--text-tertiary);
	font-size: 16px;

	@media ${QUERIES.tabletAndUp} {
		width: 60%;
	}
`;

export var LearnMoreButton = styled(Button)`
	color: var(--text-tertiary);
	transform: translateX(-5px);
`;

export var FeatureVideo = styled.video`
	display: block;
	width: 100%;
	aspect-ratio: 4 / 3;
	border: 1px solid var(--border-medium);
	border-radius: 3px;
`;
