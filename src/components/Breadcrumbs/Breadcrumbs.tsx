'use client';

import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

var Breadcrumbs = ({ children, ...delegated }: { children: React.ReactNode }) => {
	return (
		<nav aria-label='Breadcrumb' {...delegated}>
			<BreadcrumbList>{children}</BreadcrumbList>
		</nav>
	);
};

interface CrumbProps {
	href: string;
	isCurrentPage?: boolean;
}

var Crumb = ({ href, isCurrentPage, children }: CrumbProps & React.ComponentProps<'a'>) => {
	return (
		<CrumbWrapper>
			<CrumbLink href={href} aria-current={isCurrentPage ? 'page' : undefined}>
				{children}
			</CrumbLink>
		</CrumbWrapper>
	);
};

const BreadcrumbList = styled.ol`
	padding: 0;
	margin: 0;
	list-style-type: none;
	color: var(--text-primary);
`;

const CrumbWrapper = styled.li`
	display: inline;
	--spacing: 6px;

	&:not(:first-of-type) {
		margin-left: var(--spacing);
	}
	&::before {
		content: '';
		display: inline-block;
		transform: rotate(20deg) translateY(2px);
		border-right: 1px solid;
		margin-right: var(--spacing);
		height: 0.8em;
		color: var(--text-tertiary);
	}
`;

const CrumbLink = styled(Link)`
	color: var(--text-secondary);
	text-decoration: none;
	font-size: 0.8rem;

	&:hover {
		text-decoration: revert;
	}
`;

export { Breadcrumbs, Crumb };
