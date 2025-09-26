'use client';

import * as React from 'react';
import styled from 'styled-components';
import { createId } from '@paralleldrive/cuid2';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import getBlobStorageSASToken from '@/app/actions/lib/getBlobStorageSASToken';

import { handleError, handleZodError } from '@/utils';
import { ImageFileSchema } from '@/lib';
import { BLOB_CONTAINER_TYPE, TOAST_ID, USER_UPDATE_ACTION } from '@/constants';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Loading from '@/components/Loading';
import { useGlobalToastContext } from '@/components/GlobalToastProvider';
import updateUserImage from '@/app/actions/user/updateUserImage';

function UserPhoto() {
	let [isLoading, startTransition] = React.useTransition();
	let { addToToast } = useGlobalToastContext();
	let { update: updateSession, data: session } = useSession();

	async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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

		let fileExt = file.name.split('.').pop();
		let blobName = createId() + '.' + fileExt;

		startTransition(async () => {
			// upload image
			let sasToken: string, containerName: string, storageAccountName: string;
			// get sasToken
			try {
				({ sasToken, containerName, storageAccountName } = await getBlobStorageSASToken(BLOB_CONTAINER_TYPE.AUDIO));
			} catch (error) {
				let errMsg = handleError(error);
				addToToast({
					contentType: 'error',
					content: errMsg,
					id: TOAST_ID.SAS_TOKEN,
				});
				return;
			}

			let uploadUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
			let metaDataUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}?comp=metadata&${sasToken}`;
			try {
				await axios.put(uploadUrl, result.data, {
					headers: {
						'x-ms-blob-type': 'BlockBlob',
						'Content-Type': result.data.type,
					},
					maxBodyLength: Infinity, // important for large files
				});
				await axios.put(
					metaDataUrl,
					null, // no body needed
					{
						headers: {
							'x-ms-meta-userid': session?.user.id,
						},
					}
				);
			} catch (error) {
				// clean up. for example metadata update failed
				try {
					await axios.delete(uploadUrl);
				} catch (error) {
					console.error('trying to delete from blob storage but failed', error);
				}

				let errMsg = handleError(error);
				addToToast({
					contentType: 'error',
					content: errMsg,
					id: TOAST_ID.IMAGE_UPLOAD,
				});
				return;
			}

			// update user image link
			let imageUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blobName}`;
			let updateResult = await updateUserImage({ action: USER_UPDATE_ACTION.IMAGE, image: imageUrl });
			if ('error' in updateResult) {
				addToToast({
					contentType: 'error',
					content: result.error,
					id: TOAST_ID.IMAGE_UPLOAD,
				});
				return;
			}

			// update session
			await updateSession({ image: updateResult.data });
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
