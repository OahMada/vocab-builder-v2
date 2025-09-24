'use client';

import * as React from 'react';
import styled from 'styled-components';

import uploadImage from '@/app/actions/user/uploadImage';

import { ImageFileSchema } from '@/lib';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Loading from '@/components/Loading';
import { handleZodError } from '@/utils';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import { TOAST_ID } from '@/constants';
import { useSession } from 'next-auth/react';

function UserPhoto() {
	let [isLoading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();
	let { update: updateSession } = useSession();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		let file = e.target.files?.[0];
		if (!file) return;

		let result = ImageFileSchema.safeParse(file);
		if (!result.success) {
			let error = handleZodError(result.error, 'prettify');
			addToToast({
				contentType: 'error',
				content: error,
				id: TOAST_ID.IMAGE_UPLOAD,
			});
			return;
		}

		// Prepare FormData
		let formData = new FormData();
		formData.append('file', file);

		// Trigger the server action
		startTransition(async () => {
			let result = await uploadImage(formData);
			if ('error' in result) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.IMAGE_UPLOAD,
				});
				return;
			}

			await updateSession({ image: result.data });
			addToToast({
				contentType: 'notice',
				content: 'Image uploaded',
				id: TOAST_ID.IMAGE_UPLOAD,
			});
		});

		// make ready for next upload
		e.target.value = '';
	}

	return (
		<Wrapper>
			<Avatar fallbackStyle='fill' />
			<UploadButton variant='outline' disabled={isLoading}>
				{isLoading ? (
					<>
						<Loading description='Uploading' />
						&nbsp;Uploading
					</>
				) : (
					<>
						<Icon id='upload' size={14} />
						&nbsp;Upload
					</>
				)}
			</UploadButton>
			<Input type='file' accept='.jpg,.jpeg,.gif,.png,.webp' onChange={handleChange} disabled={isLoading} />
		</Wrapper>
	);
}

export default UserPhoto;

var Wrapper = styled.div`
	position: relative;
	border-radius: 100%;
	background-color: var(--bg-secondary);
	margin-bottom: 10px;
	position: relative;
`;

var UploadButton = styled(Button)`
	--bg-color: var(--bg-secondary);
	--hover-bg-color: var(--bg-secondary-hover);
	position: absolute;
	bottom: -10px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 0.8rem;
	box-shadow: var(--shadow-elevation-low);
	backdrop-filter: blur(15px);
`;

var Input = styled.input`
	position: absolute;
	width: 100%;
	height: calc(100% + 10px);
	opacity: 0;
	top: 0;
`;
