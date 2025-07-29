import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Metadata } from 'next';
import { InnerWrapper, NotFoundTitle, Wrapper } from './NotFoundStyledComponents';
import NavLink from '@/components/NavLink';

// TODO add auto jump and count down

export var metadata: Metadata = {
	title: 'Not Found | Vocab Builder',
	description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
	return (
		<MaxWidthWrapper>
			<Wrapper>
				<InnerWrapper>
					<NotFoundTitle>Not Found</NotFoundTitle>
					<p>Could not find requested resource.</p>
					<NavLink href='/'>Return Home</NavLink>
				</InnerWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
