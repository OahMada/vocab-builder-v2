import * as React from 'react';

import { PiecesType, PieceWithSearchMatch } from '@/types';

import WordWithPhoneticSymbol, { CombinedLastTwoPieces } from '@/components/WordWithPhoneticSymbol';
import SearchMatchedWord from '@/components/SearchMatchedWord';

export function constructSentence(pieces: PieceWithSearchMatch[] | PiecesType) {
	let constructedSentence: React.ReactNode[] = [];
	let lastItem = pieces.at(-1);
	let lastIsPunctuation = typeof lastItem === 'string';

	for (let item of pieces) {
		if (typeof item === 'string') {
			// whitespaces, punctuations
			constructedSentence.push(item);
		} else {
			let wordEle: React.ReactNode;
			if ('isSearchMatch' in item && item.isSearchMatch) {
				if (item.IPA) {
					wordEle = (
						<WordWithPhoneticSymbol key={item.id} symbol={item.IPA}>
							<SearchMatchedWord>{item.word}</SearchMatchedWord>
						</WordWithPhoneticSymbol>
					);
				} else {
					wordEle = <SearchMatchedWord key={item.id}>{item.word}</SearchMatchedWord>;
				}
			} else {
				if (item.IPA) {
					wordEle = (
						<WordWithPhoneticSymbol key={item.id} symbol={item.IPA}>
							{item.word}
						</WordWithPhoneticSymbol>
					);
				} else {
					wordEle = item.word;
				}
			}
			constructedSentence.push(wordEle);
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
