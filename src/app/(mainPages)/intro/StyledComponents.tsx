'use client';

import styled from 'styled-components';
import Image from 'next/image';

export var Slogan = styled.h1`
	font-size: 48px;
	font-weight: 800;
	line-height: 1;
`;

export var SloganDescription = styled.p`
	font-size: 16px;
	color: var(--text-tertiary);
`;
export var SloganWrapper = styled.section`
	margin-top: 48px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
`;

export var FeaturesWrapper = styled.section`
	padding: 24px;
	display: flex;
	gap: 60px;
	flex-direction: column;
`;

export var Feature = styled.article`
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: flex-start;
`;

export var FeatureTitle = styled.h2`
	font-size: 24px;
	line-height: 1;
	width: min-content;
`;

export var FeatureDesc = styled.p`
	color: var(--text-tertiary);
	font-size: 16px;
`;
export var ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 3 / 4;
	border: 1px solid var(--border-medium);
	border-radius: 3px;
`;
export var FeatureImage = styled(Image)`
	object-fit: cover;
	object-position: var(--object-position);
	transform: scale(0.9);
`;
