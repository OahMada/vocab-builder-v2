'use client';

import styled from 'styled-components';
import Image from 'next/image';

import { QUERIES } from '@/constants';

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
		margin-top: 120px;
		margin-bottom: 120px;
	}
`;

export var FeaturesWrapper = styled.section`
	padding: 24px;
	display: flex;
	gap: 80px;
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

	@media ${QUERIES.tabletAndUp} {
		width: auto;
	}
`;

export var FeatureDesc = styled.p`
	color: var(--text-secondary);
	font-size: 16px;
`;

export var LearnMore = styled.div`
	color: var(--text-secondary);
	display: flex;
	gap: 5px;
	align-items: center;
`;

export var FeatureVideoWrapper = styled.div`
	aspect-ratio: 4 / 3;
	width: 100%;
	border: 1px solid var(--border);
	border-radius: 3px;
	margin-top: 48px;
`;

export var ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 4 / 3;
	border: 1px solid var(--border);
	border-radius: 3px;
	margin-top: 48px;
`;
export var FeatureImage = styled(Image)`
	border-radius: 3px;
`;
