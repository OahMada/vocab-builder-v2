import 'server-only';

import path from 'path';
import fs from 'fs/promises';
import matter, { GrayMatterFile } from 'gray-matter';

interface Frontmatter {
	title: string;
	lastUpdated: string;
}

export default async function loadPost(name: string) {
	let rawContent = '';
	try {
		rawContent = await readFile(`/posts/${name}.mdx`);
	} catch (error) {
		console.error('failed to read mdx file', error);
		return null;
	}

	let parsed: GrayMatterFile<string> = matter(rawContent);

	let { data: frontmatter, content } = parsed as unknown as {
		data: Frontmatter;
		content: string;
	};

	return { frontmatter, content };
}

function readFile(localPath: string) {
	return fs.readFile(path.join(process.cwd(), localPath), 'utf8');
}
