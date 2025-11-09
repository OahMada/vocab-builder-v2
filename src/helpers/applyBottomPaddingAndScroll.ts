import { getPrefersReducedMotion } from './getPrefersReducedMotion';

export function applyBottomPaddingAndScroll(element: HTMLElement | null, bottomPadding: number, shouldScroll: boolean = true) {
	if (!element) return;
	// set the padding
	element.style.paddingBottom = `${bottomPadding}px`;
	// scroll to beyond bottom
	if (shouldScroll) {
		let prefersReducedMotion = getPrefersReducedMotion();
		element.scrollTo({
			top: element.scrollHeight + bottomPadding - element.clientHeight,
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
		});
	}
}
