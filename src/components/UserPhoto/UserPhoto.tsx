'use client';

import * as React from 'react';
import Avatar from '@/components/Avatar';
import styled from 'styled-components';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

function UserPhoto() {
	return (
		<Wrapper>
			<Avatar src='https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80' />
			<UploadButton variant='outline'>
				<Icon id='upload' size={14} />
				&nbsp;Upload
			</UploadButton>
		</Wrapper>
	);
}

export default UserPhoto;

var Wrapper = styled.div`
	position: relative;
	width: 100px;
	height: 100px;
	border-radius: 100vmax;
	user-select: none;
	background-color: var(--bg-secondary);
	box-shadow: var(--shadow-elevation-low);
`;

var UploadButton = styled(Button)`
	--bg-color: var(--bg-secondary);
	--hover-bg-color: var(--bg-secondary-hover);
	position: absolute;
	bottom: -10px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 0.8rem;
	box-shadow: var(--shadow-elevation-medium);
	backdrop-filter: blur(15px);
`;
