import { Metadata } from 'next';
import * as React from 'react';

import Wrapper from '@/components/PageWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import {
	SloganWrapper,
	Slogan,
	SloganDescription,
	FeaturesWrapper,
	Feature,
	FeatureTitle,
	FeatureDesc,
	FeatureVideoWrapper,
	FeatureImage,
	ImageWrapper,
	LearnMore,
} from './StyledComponents';
import Icon from '@/components/Icon';
import Video from '@/components/Video';
import NavLink from '@/components/NavLink';

export var metadata: Metadata = {
	title: 'Intro | Vocab Builder',
};

export default async function IntroPage() {
	return (
		<MaxWidthWrapper>
			<Wrapper $position='flex-start'>
				<SloganWrapper>
					<Slogan>Grow Vocabulary in Context</Slogan>
					<SloganDescription>
						Vocab Builder streamlines collecting sentences, adding information, and transferring them to Anki for efficient memorization.
					</SloganDescription>
				</SloganWrapper>
				<FeaturesWrapper>
					<Feature>
						<FeatureTitle>Sentence Input</FeatureTitle>
						<FeatureDesc>Type or paste in a sentence you want to keep.</FeatureDesc>
						<ImageWrapper>
							<FeatureImage src='/media/home_page.png' fill={true} alt='home page' />
						</ImageWrapper>
					</Feature>
					<Feature>
						<FeatureTitle>Word Annotation</FeatureTitle>
						<FeatureDesc>
							During the sentence-saving process, you can tap or click any words you are not familiar with to include their phonetic symbols (IPA).
						</FeatureDesc>
						<FeatureVideoWrapper>
							<Video src='/media/word_annotation.mp4' />
						</FeatureVideoWrapper>
					</Feature>
					<Feature>
						<FeatureTitle>Ask Questions</FeatureTitle>
						<FeatureDesc>
							If there are parts of the sentence that you don&apos;t quite understand, you can ask about them by tapping the question(?) button.
						</FeatureDesc>
						<FeatureVideoWrapper>
							<Video src='/media/ask_questions.mp4' />
						</FeatureVideoWrapper>
					</Feature>
					<Feature>
						<FeatureTitle>Audio Support</FeatureTitle>
						<FeatureDesc>The app will automatically generate audio for the sentence.</FeatureDesc>
					</Feature>
					<Feature>
						<FeatureTitle>Browse & Search</FeatureTitle>
						<FeatureDesc>Navigate to the Browse page to view your sentence collection, and do searches.</FeatureDesc>
						<FeatureVideoWrapper>
							<Video src='/media/browse_and_search.mp4' />
						</FeatureVideoWrapper>
					</Feature>
					<Feature>
						<FeatureTitle>Export to Anki</FeatureTitle>
						<FeatureDesc>You can export your data on the Account page and later sync it to Anki.</FeatureDesc>
						<LearnMore>
							<NavLink href='/sync' prefetch={true}>
								Learn more
							</NavLink>
							<Icon id='forward' size={14} />
						</LearnMore>
					</Feature>
				</FeaturesWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
