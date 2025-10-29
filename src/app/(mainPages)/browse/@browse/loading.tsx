import * as React from 'react';

import NoticeText from '@/components/BrowsePageNoticeText';
import { LoadingFallback, LoadingWrapper, LoadingText } from '../StyledComponents';
import InnerWidthWrapper from '@/components/InnerWidthWrapper';

export default function Loading() {
	return (
		<InnerWidthWrapper>
			<LoadingWrapper>
				<NoticeText>Counting records...</NoticeText>
				<LoadingFallback>
					<LoadingText>Loading...</LoadingText>
				</LoadingFallback>
			</LoadingWrapper>
		</InnerWidthWrapper>
	);
}
