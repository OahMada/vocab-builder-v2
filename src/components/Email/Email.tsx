import * as React from 'react';
import { Html, Button, Head, Body, Container, Preview, Text, Heading, CodeInline } from '@react-email/components';

// TODO align the colors with App web pages

function Email({ url }: { url: string }) {
	return (
		<Html lang='en'>
			<Head />
			<Body style={main}>
				<Preview>Log in to Vocab Builder</Preview>
				<Container style={container}>
					<Heading style={heading}>Log in to Vocab Builder</Heading>
					<Button href={url} style={button}>
						Click to login
					</Button>
					<Text style={text}>Here&apos;s the login link once more, printed for you to copy/paste:</Text>
					<CodeInline style={fallbackUrl}>{url}</CodeInline>
					<Text style={text}>This link is valid for a single use and expires in 24 hours.</Text>
					<Text style={footer}>If you did not request this email you can safely ignore it.</Text>
				</Container>
			</Body>
		</Html>
	);
}

export default Email;

var main = {
	backgroundColor: '#f6f9fc',
	padding: '40px 0',
};

var container = {
	borderRadius: '5px',
	marginTop: '20px',
	maxWidth: '480px',
	margin: '0 auto',
	padding: '20px 40px',
};

var button = {
	borderRadius: '6px',
	fontWeight: '600',
	fontSize: '16px',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'inline-block',
	padding: '10px 20px',
	color: '#fff',
	backgroundColor: '#313131',
};

var heading = {
	color: '#111',
	fontSize: '24px',
	fontWeight: '700',
	margin: '0 0 24px',
	padding: '0',
	fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
};

var text = {
	fontSize: '16px',
	lineHeight: '24px',
	color: '#444',
	margin: '16px 0',
	fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
};

var footer = {
	color: '#898989',
	fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
	fontSize: '12px',
	lineHeight: '22px',
	margin: '16px 0',
};

var fallbackUrl = {
	fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
	fontSize: '14px',
	lineHeight: '20px',
	color: '#111',
	backgroundColor: '#f5f5f5',
	padding: '2px 0',
	borderRadius: '4px',
	wordBreak: 'break-all' as const,
};
