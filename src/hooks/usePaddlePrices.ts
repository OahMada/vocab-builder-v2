import { initializePaddle, Environments, PricePreviewParams } from '@paddle/paddle-js';
import * as React from 'react';

import { PRICE_TIER } from '@/constants';

type PaddlePrices = Record<string, string>;

export function usePaddlePrices(): { loading: boolean; currencyCode: string; priceMap: PaddlePrices } {
	let [priceMap, setPriceMap] = React.useState<PaddlePrices>({});
	let [currencyCode, setCurrencyCode] = React.useState('');
	let [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		async function fetchPaddlePrices() {
			setLoading(true);
			let paddle = await initializePaddle({
				token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
				environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
			});
			if (!paddle) {
				console.error('Paddle is not initialized');
				return;
			}
			let pricePreviewParam = PRICE_TIER.map((item) => ({ quantity: 1, priceId: item.priceId }));
			let paddlePricePreviewRequest: Partial<PricePreviewParams> = { items: pricePreviewParam };
			try {
				let result = await paddle.PricePreview(paddlePricePreviewRequest as PricePreviewParams);
				setCurrencyCode(result.data.currencyCode);
				result.data.details.lineItems.map((item) => setPriceMap((prevState) => ({ ...prevState, [item.price.id]: item.formattedUnitTotals.total })));
			} catch (error) {
				console.error('Failed to fetch Paddle prices', error);
			}
			setLoading(false);
		}
		fetchPaddlePrices();
	}, []);

	return { loading, currencyCode, priceMap };
}
