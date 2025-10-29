import * as React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import loadPost from '@/helpers/readPost';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from '@/components/CustomBreadcrumb';
import { BlogP, InnerWrapper, BlogTitle } from '@/components/BlogComponents';
import NavLink from '@/components/NavLink';
import InnerWidthWrapper from '@/components/InnerWidthWrapper';

export var metadata: Metadata = {
	title: 'About | Vocab Builder',
};

export default async function AboutPage() {
	let blogPostData = await loadPost('about');
	if (!blogPostData) {
		notFound();
	}

	let {
		frontmatter: { lastUpdated, title },
		content,
	} = blogPostData;

	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<Breadcrumb page='About' link='/about' />
				<InnerWidthWrapper>
					<InnerWrapper>
						<BlogTitle title={title} lastUpdated={lastUpdated} />
						<MDXRemote source={content} components={{ p: BlogP, a: (props) => <NavLink $underScored={true} {...props} /> }} />
					</InnerWrapper>
				</InnerWidthWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
