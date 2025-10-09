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
	FeatureImage,
	ImageWrapper,
	FeatureDesc,
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
						<ImageWrapper>
							<FeatureImage
								src='/images/annotate_words.png'
								fill={true}
								alt='annotate words'
								style={{ '--object-position': 'top' } as React.CSSProperties}
							/>
						</ImageWrapper>
					</Feature>
					<Feature>
						<FeatureTitle>Ask Questions</FeatureTitle>
						<FeatureDesc>
							If there are parts of the sentence that you don&apos;t quite understand, you can ask about them by tapping the question(?) button.
						</FeatureDesc>
						<ImageWrapper>
							<FeatureImage
								src='/images/ask_questions.png'
								fill={true}
								alt='ask questions'
								style={{ '--object-position': 'bottom' } as React.CSSProperties}
							/>
						</ImageWrapper>
					</Feature>
					<Feature>
						<FeatureTitle>Audio Support</FeatureTitle>
						<FeatureDesc>The app will automatically generate audio for the sentence.</FeatureDesc>
					</Feature>
					<Feature>
						<FeatureTitle>Browse & Search</FeatureTitle>
						<FeatureDesc>Navigate to the Browse page to view your sentence collection, and do searches.</FeatureDesc>
						<ImageWrapper>
							<FeatureImage
								src='/images/browse_and_search.png'
								fill={true}
								alt='browse and search sentence'
								style={{ '--object-position': '0% 20%' } as React.CSSProperties}
							/>
						</ImageWrapper>
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
