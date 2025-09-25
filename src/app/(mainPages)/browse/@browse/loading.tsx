import * as React from 'react';

import NoticeText from '@/components/BrowsePageNoticeText';
import { LoadingInnerWrapper, LoadingSpinner, LoadingWrapper } from '../StyledComponents';

export default function Loading() {
	return (
		<LoadingWrapper>
			<NoticeText>Counting records...</NoticeText>
			<LoadingInnerWrapper>
				<LoadingSpinner description='Loading sentence list' size={25} />
			</LoadingInnerWrapper>
		</LoadingWrapper>
	);
}
