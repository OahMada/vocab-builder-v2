import { CheckoutEventsTimePeriod } from '@paddle/paddle-js';

export function formatMoney(amount: number = 0, currency: string = 'USD') {
	let language = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
	return new Intl.NumberFormat(language ?? 'en-US', {
		style: 'currency',
		currency: currency,
	}).format(amount);
}

const BillingCycleMap = {
	day: 'daily',
	week: 'weekly',
	month: 'monthly',
	year: 'yearly',
};

const CustomBillingCycleMap = {
	day: 'days',
	week: 'weeks',
	month: 'months',
	year: 'years',
};

export function formatBillingCycle({ frequency, interval }: CheckoutEventsTimePeriod) {
	if (frequency === 1) {
		return BillingCycleMap[interval];
	} else {
		return `every ${frequency} ${CustomBillingCycleMap[interval]}`;
	}
}
