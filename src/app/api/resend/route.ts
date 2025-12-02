/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { Attachment } from 'resend';

import resend from '@/lib/resend';

export async function POST(request: NextRequest) {
	try {
		let payload = await request.text();
		let result = resend.webhooks.verify({
			payload,
			headers: {
				id: request.headers.get('svix-id') || '',
				timestamp: request.headers.get('svix-timestamp') || '',
				signature: request.headers.get('svix-signature') || '',
			},
			webhookSecret: process.env.RESEND_SIGNING_SECRET!,
		}) as { type: string; data: any };

		if (result.type === 'email.received') {
			try {
				let emailId = result.data.email_id;
				let subject = result.data.subject;

				let { data: email, error: getEmailError } = await resend.emails.receiving.get(emailId);
				let { data: attachments, error: listAttachmentsError } = await resend.emails.receiving.attachments.list({ emailId });

				if (getEmailError) {
					console.error('Failed to read incoming email', getEmailError);
				}
				if (listAttachmentsError) {
					console.error('Failed to read incoming email attachments', listAttachmentsError);
				}

				if (email && email.to.includes('support@vocab-builder.app')) {
					let attachmentData: Attachment[] = [];
					if (attachments) {
						// download the attachments and encode them in base64
						for (let attachment of attachments?.data) {
							let response = await fetch(attachment.download_url);
							let buffer = Buffer.from(await response.arrayBuffer());
							attachmentData.push({ content: buffer.toString('base64'), filename: attachment.filename });
						}
					}

					let { data, error } = await resend.emails.send({
						from: 'VB Support <support@vocab-builder.app>',
						to: [process.env.PERSONAL_EMAIL!],
						subject: subject,
						html: email.html
							? `${email.html}
						<br />
						<br />
						<a href="mailto:${email.from}?subject=Re:%20${encodeURIComponent(email.subject)}&body=${encodeURIComponent('\n\n---- Original Message ----\n' + (email.text || ''))}">
							Reply
						</a>
						<br />
						<br />`
							: `Sender: ${email.from}`,
						text: email.text ? `${email.text}\r\nSender: ${email.from}` : `Sender: ${email.from}`,
						attachments: attachmentData,
					});

					if (error) {
						console.error('Failed to forward email', error);
						return NextResponse.json({});
					}
					return NextResponse.json(data);
				}
			} catch (error) {
				console.error('something went wrong', error);
			}
		}

		return NextResponse.json({});
	} catch (error) {
		console.error('Unable to verify webhook', error);
		return new NextResponse('Invalid webhook', { status: 400 });
	}
}
