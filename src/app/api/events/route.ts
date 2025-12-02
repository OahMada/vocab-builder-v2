import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { CreateEmailOptions, Attachment } from 'resend';

import resend from '@/lib/resend';

export async function POST(request: NextRequest) {
	let event = await request.json();

	if (event.type === 'email.received') {
		let { data: email, error: getEmailError } = await resend.emails.receiving.get(event.data.email_id);
		let { data: attachments, error: listAttachmentsError } = await resend.emails.receiving.attachments.list({ emailId: event.data.email_id });

		if (getEmailError) {
			console.error('Failed to read incoming email', getEmailError);
		}
		if (listAttachmentsError) {
			console.error('Failed to read incoming email attachments', listAttachmentsError);
		}

		if (email) {
			let attachMentData: Attachment[] = [];
			if (attachments) {
				// download the attachments and encode them in base64
				for (let attachment of attachments?.data) {
					let response = await fetch(attachment.download_url);
					let buffer = Buffer.from(await response.arrayBuffer());
					attachMentData.push({ content: buffer.toString('base64'), filename: attachment.filename });
				}
			}

			let payload: CreateEmailOptions = {
				from: 'support@vocab-builder.app',
				to: ['haozg44@gmail.com'],
				subject: event.data.subject as string,
				html: email.html ?? '',
				text: email.text ?? '',
				attachments: attachMentData,
			};

			let { data, error } = await resend.emails.send(payload);

			if (error) {
				console.error('Failed to forward email', error);
			}
			return NextResponse.json(data);
		}
	}

	return NextResponse.json({});
}
