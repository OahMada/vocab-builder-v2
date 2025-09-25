import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

import { segmentSentence } from '../src/helpers/segmentSentence';
import { ENGLISH_IPA } from '../src/constants';

type DataType = Prisma.SentenceCreateInput;

var dummyData: DataType[] = [];

var uniqueSentences = faker.helpers.uniqueArray(() => {
	let lengthCount = faker.number.int({ min: 2, max: 5 });
	let sentence = faker.lorem.paragraph(lengthCount);
	let translation = faker.lorem.paragraph(lengthCount);
	return { sentence, translation };
}, 200);

for (let pair of uniqueSentences) {
	let words = segmentSentence(pair.sentence)
		.filter((item) => typeof item !== 'string')
		.map((item) => ({ ...item, IPA: Math.random() < 0.2 ? faker.string.fromCharacters(ENGLISH_IPA, { min: 5, max: 10 }) : null }));

	let data: DataType = {
		id: createId(),
		sentence: pair.sentence,
		translation: pair.translation,
		note: Math.random() < 0.5 ? null : faker.lorem.sentence(),
		audioUrl: faker.internet.url(),
		pieces: {
			create: words,
		},
		user: {
			connect: {
				id: process.env.DEMO_USERID,
			},
		},
	};

	dummyData.push(data);
}

var prisma = new PrismaClient();
async function main() {
	console.log('Start seeding ...');
	for (let sentence of dummyData) {
		let newEntry = await prisma.sentence.create({ data: sentence });
		console.log(`Created sentence with id: ${newEntry.id}`);
	}
	console.log('Seeding finished.');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
