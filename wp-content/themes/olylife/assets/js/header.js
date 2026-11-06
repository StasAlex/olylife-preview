(() => {
	const header = document.querySelector('[data-header]');
	if (!header) return;
	const burger = header.querySelector('.hd-burger');
	const openLabel = burger.getAttribute('aria-label');
	const closeLabel = burger.dataset.closeLabel;

	// Toggle mobile navigation.
	const setOpen = (open) => {
		header.classList.toggle('is-open', open);
		burger.setAttribute('aria-expanded', String(open));
		burger.setAttribute('aria-label', open ? closeLabel : openLabel);
	};

	burger.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
	header.querySelectorAll('.hd-mobile a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') setOpen(false);
	});
})();

(() => {
	const header = document.querySelector('.hd--over');
	if (!header) return;
	let last = window.scrollY;

	// Solid header after scrolling, hide on scroll down and show on scroll up.
	const onScroll = () => {
		const y = window.scrollY;
		header.classList.toggle('is-scrolled', y > 40);
		header.classList.toggle('is-hidden', y > 600 && y > last);
		last = y;
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
})();
