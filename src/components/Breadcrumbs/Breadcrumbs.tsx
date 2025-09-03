'use client';

import * as React from 'react';
import styled from 'styled-components';
import NavLink from '@/components/NavLink';

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

var BreadcrumbList = styled.ol`
	padding: 0;
	margin: 0;
	list-style-type: none;
`;

var CrumbWrapper = styled.li`
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

var CrumbLink = styled(NavLink)`
	color: var(--text-secondary);
	font-size: 0.8rem;
`;

export { Breadcrumbs, Crumb };
