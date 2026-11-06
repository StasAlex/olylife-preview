(() => {
	// Smooth height animation for <details> accordions.
	const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
	document.querySelectorAll('.product-faq details, .buy-more').forEach((d) => {
		const sum = d.querySelector('summary');
		if (!sum || calm) return;
		let anim = null;
		sum.addEventListener('click', (e) => {
			e.preventDefault();
			const closing = d.open;
			const from = d.offsetHeight;
			if (!closing) d.open = true;
			const to = closing ? sum.offsetHeight : d.scrollHeight;
			anim?.cancel();
			anim = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
			anim.onfinish = () => {
				if (closing) d.open = false;
				anim = null;
			};
		});
	});

	// Click anywhere on the product video to start playback.
	document.querySelectorAll('.product-video').forEach((fig) => {
		const video = fig.querySelector('video');
		if (!video) return;
		video.controls = false;
		fig.classList.add('is-idle');
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'product-video-play';
		btn.setAttribute('aria-label', video.getAttribute('aria-label') || 'Play');
		btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
		fig.appendChild(btn);
		const start = () => {
			if (!fig.classList.contains('is-idle')) return;
			fig.classList.remove('is-idle');
			video.controls = true;
			video.play();
		};
		video.addEventListener('click', start);
		btn.addEventListener('click', start);
	});

	// Glow follows the pointer on the consultant card.
	document.querySelectorAll('.product-help').forEach((el) => {
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			el.style.setProperty('--x', `${e.clientX - r.left}px`);
			el.style.setProperty('--y', `${e.clientY - r.top}px`);
		}, { passive: true });
	});
})();
