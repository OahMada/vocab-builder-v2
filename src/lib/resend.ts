import 'server-only';

import { Resend } from 'resend';

var apiKey = process.env.RESEND_KEY;
if (!apiKey) {
	throw new Error('Resend api key not found!');
}

var resend = new Resend(apiKey);

export default resend;
