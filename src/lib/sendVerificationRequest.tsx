import 'server-only';

import { EmailProviderSendVerificationRequestParams } from 'next-auth/providers';
import resend from '@/lib/resend';
import Email from '@/components/Email';

var sendVerificationRequest = async (params: EmailProviderSendVerificationRequestParams) => {
	let { identifier: to, provider, url } = params;
	try {
		await resend.emails.send({
			from: provider.from!,
			to,
			subject: 'Your login link',
			react: <Email url={url} />,
			text: text({ url }),
		});
	} catch (error) {
		console.error('Failed to send email with Resend:', error);
		throw new Error('EmailSendingFailed');
	}
};

export default sendVerificationRequest;

function text({ url }: { url: string }) {
	return `Sign in to Vocab Builder\n${url}\n\n`;
}
