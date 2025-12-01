import * as React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import loadPost from '@/helpers/readPost';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Wrapper from '@/components/PageWrapper';
import Breadcrumb from '@/components/CustomBreadcrumb';
import { BlogP, InnerWrapper, BlogTitle, UnorderedList, BlogH2, BlogH3, BlogList, BlogH4 } from '@/components/BlogComponents';
import NavLink from '@/components/NavLink';
import InnerWidthWrapper from '@/components/InnerWidthWrapper';

export var metadata: Metadata = {
	title: 'Privacy Policy | Vocab Builder',
};

export default async function CookiesPolicyPage() {
	let blogPostData = await loadPost('privacy-policy');
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
				<Breadcrumb page='Privacy Policy' link='/privacy' />
				<InnerWidthWrapper>
					<InnerWrapper>
						<BlogTitle title={title} lastUpdated={lastUpdated} />
						<MDXRemote
							source={content}
							components={{
								a: (props) => <NavLink $underScored={true} {...props} />,
								ul: UnorderedList,
								p: BlogP,
								h2: BlogH2,
								h3: BlogH3,
								li: BlogList,
								h4: BlogH4,
							}}
						/>
					</InnerWrapper>
				</InnerWidthWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
