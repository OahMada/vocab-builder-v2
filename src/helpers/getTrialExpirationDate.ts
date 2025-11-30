import 'server-only';

export default function getTrialExpirationDate(data: Date) {
	return new Date(data.getTime() + 3 * 24 * 60 * 60 * 1000);
}
