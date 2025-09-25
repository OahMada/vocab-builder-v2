import * as React from 'react';
import { Piece } from '@prisma/client';

import { segmentSentence } from '@/helpers';
import { SentenceWithPieces } from '@/lib';

import WordWithPhoneticSymbol, { CombinedLastTwoPieces } from '@/components/WordWithPhoneticSymbol';
import SearchMatchedWord from '@/components/SearchMatchedWord';

export function constructSentence(wholeSentence: string, pieces: SentenceWithPieces['pieces']) {
	let result = segmentSentence(wholeSentence);
	let piecesMap: [string, Omit<Piece & { isSearchMatch?: boolean }, 'sentenceId'>][] = pieces.map((item) => [item.word, item]);
	let constructedSentence: React.ReactNode[] = [];
	let lastItem = result.at(-1);
	let lastIsPunctuation = typeof lastItem === 'string';

	for (let item of result) {
		if (typeof item === 'string') {
			// whitespaces, punctuations
			constructedSentence.push(item);
		} else {
			let index = piecesMap.findIndex((piece) => piece[0] === item.word);
			if (index !== -1) {
				let matchedPiece = piecesMap[index][1];

				if (!matchedPiece.IPA) {
					// word with IPA
					if (matchedPiece.isSearchMatch) {
						constructedSentence.push(<SearchMatchedWord key={item.id}>{item.word}</SearchMatchedWord>);
					} else {
						constructedSentence.push(item.word);
					}
				} else {
					// word without IPA
					let wordEle: React.ReactNode;

					if (matchedPiece.isSearchMatch) {
						wordEle = (
							<WordWithPhoneticSymbol key={item.id} symbol={matchedPiece.IPA}>
								<SearchMatchedWord>{item.word}</SearchMatchedWord>
							</WordWithPhoneticSymbol>
						);
					} else {
						wordEle = (
							<WordWithPhoneticSymbol key={item.id} symbol={matchedPiece.IPA}>
								{item.word}
							</WordWithPhoneticSymbol>
						);
					}
					constructedSentence.push(wordEle);
				}
				// remove already matched word to deal with duplications
				piecesMap = [...piecesMap.slice(0, index), ...piecesMap.slice(index + 1)];
			}
		}
	}

	let secondLastItem = constructedSentence.at(-2);
	let secondLastIsReactComponent = React.isValidElement(secondLastItem) && !!secondLastItem;

	// to prevent the case where only the last punctuation and audio button are pushed onto the new line.
	if (lastIsPunctuation && secondLastIsReactComponent) {
		let combinedLastTwoPiece = (
			<CombinedLastTwoPieces key='last-two'>
				{secondLastItem}
				{lastItem as string}
			</CombinedLastTwoPieces>
		);
		constructedSentence = [...constructedSentence.slice(0, -2), combinedLastTwoPiece];
	}

	return constructedSentence;
}
