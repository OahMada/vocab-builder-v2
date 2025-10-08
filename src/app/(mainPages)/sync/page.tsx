import * as React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import loadPost from '@/helpers/readPost';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from '@/components/CustomBreadcrumb';
import {
	BlogP,
	InnerWrapper,
	BlogTitle,
	InlineCode,
	CodeBlock,
	OrderedList,
	UnorderedList,
	Aside,
	BlogImage,
	ImageWrapper,
	ImageOuterWrapper,
} from '@/components/BlogComponents';
import NavLink from '@/components/NavLink';

export var metadata: Metadata = {
	title: 'Sync | Vocab Builder',
};

export default async function AboutPage() {
	let blogPostData = await loadPost('sync');
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
				<Breadcrumb page='Sync' link='/sync' />
				<InnerWrapper>
					<BlogTitle title={title} lastUpdated={lastUpdated} />
					<MDXRemote
						source={content}
						components={{
							p: BlogP,
							a: (props) => <NavLink $underScored={true} {...props} />,
							code: InlineCode,
							pre: CodeBlock,
							ul: UnorderedList,
							ol: OrderedList,
							Aside,
							img: (props) => <BlogImage {...props} fill={true} />,
							ImageWrapper,
							ImageOuterWrapper,
						}}
					/>
				</InnerWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
