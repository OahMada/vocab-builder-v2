export function wrapIPAWithSlashes(IPA: string) {
	if (!IPA.startsWith('/')) {
		IPA = `/${IPA}`;
	}
	if (!IPA.endsWith('/')) {
		IPA = `${IPA}/`;
	}
	return IPA;
}
