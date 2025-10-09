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
	FeatureVideo,
	LearnMoreButton,
} from './StyledComponents';
import Icon from '@/components/Icon';

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
						<FeatureTitle>Word Annotation</FeatureTitle>
						<FeatureDesc>
							During the sentence-saving process, you can tap or click any words you are not familiar with to include their phonetic symbols (IPA).
						</FeatureDesc>
						<FeatureVideo src='/media/word_annotation.mp4' playsInline={true} autoPlay={true} loop={true} muted={true} />
					</Feature>
					<Feature>
						<FeatureTitle>Ask Questions</FeatureTitle>
						<FeatureDesc>
							If there are parts of the sentence that you don&apos;t quite understand, you can ask about them by tapping the question(?) button.
						</FeatureDesc>
						<FeatureVideo src='/media/ask_questions.mp4' playsInline={true} autoPlay={true} loop={true} muted={true} />
					</Feature>
					<Feature>
						<FeatureTitle>Audio Support</FeatureTitle>
						<FeatureDesc>The app will automatically generate audio for the sentence.</FeatureDesc>
					</Feature>
					<Feature>
						<FeatureTitle>Browse & Search</FeatureTitle>
						<FeatureDesc>Navigate to the Browse page to view your sentence collection, and do searches.</FeatureDesc>
						<FeatureVideo src='/media/browse_and_search.mp4' playsInline={true} autoPlay={true} loop={true} muted={true} />
					</Feature>
					<Feature>
						<FeatureTitle>Export to Anki</FeatureTitle>
						<FeatureDesc>You can export your data on the Account page and later sync it to Anki.</FeatureDesc>
						<LearnMoreButton variant='icon' href='/sync'>
							<Icon id='forward' />
							&nbsp; Learn more
						</LearnMoreButton>
					</Feature>
				</FeaturesWrapper>
			</Wrapper>
		</MaxWidthWrapper>
	);
}
