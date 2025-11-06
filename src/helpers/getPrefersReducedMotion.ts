export function getPrefersReducedMotion() {
	let mediaQueryList = window.matchMedia('(prefers-reduced-motion: no-preference)');

	let prefersReducedMotion = !mediaQueryList.matches;

	return prefersReducedMotion;
}
