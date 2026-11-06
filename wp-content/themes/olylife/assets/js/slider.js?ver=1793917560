(() => {
	// Scroll-snap slider with arrows, progress and mouse drag.
	const init = (root) => {
		const track = root.querySelector('.sl-track');
		if (!track) return;
		const prev = root.querySelector('.sl-btn.is-prev');
		const next = root.querySelector('.sl-btn.is-next');
		const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 20;
		const loop = root.hasAttribute('data-loop') && track.children.length > 1;
		let first = null;
		let setW = 0;

		// Clone items on both sides so the loop can jump seamlessly.
		if (loop) {
			const items = [...track.children];
			const clone = (el) => {
				const c = el.cloneNode(true);
				c.setAttribute('aria-hidden', 'true');
				c.querySelectorAll('a, button').forEach((a) => a.setAttribute('tabindex', '-1'));
				return c;
			};
			items.forEach((el) => track.append(clone(el)));
			items.slice().reverse().forEach((el) => track.prepend(clone(el)));
			first = items[0];
		}

		const measure = () => {
			if (!loop) return;
			setW = track.children[track.children.length / 3 * 2].offsetLeft - first.offsetLeft;
		};
		const home = () => first.offsetLeft - track.firstElementChild.offsetLeft;
		const jump = (left) => {
			track.style.scrollSnapType = 'none';
			track.scrollLeft = left;
			requestAnimationFrame(() => { track.style.scrollSnapType = ''; });
		};

		const update = () => {
			if (loop) {
				const pos = ((track.scrollLeft - home()) % setW + setW) % setW;
				root.style.setProperty('--sl-p', Math.max(.08, (pos + track.clientWidth) / (setW + track.clientWidth)).toFixed(3));
				return;
			}
			const max = track.scrollWidth - track.clientWidth;
			const p = max > 0 ? track.scrollLeft / max : 1;
			root.style.setProperty('--sl-p', Math.max(track.clientWidth / track.scrollWidth, p).toFixed(3));
			if (prev) prev.disabled = track.scrollLeft < 4;
			if (next) next.disabled = track.scrollLeft > max - 4;
		};

		// Wrap back into the middle set once scrolling settles.
		let settle = 0;
		const wrap = () => {
			if (!loop || track.classList.contains('is-drag')) return;
			const h = home();
			if (track.scrollLeft >= h + setW - 2) jump(track.scrollLeft - setW);
			else if (track.scrollLeft < h - setW / 2) jump(track.scrollLeft + setW);
		};

		prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
		next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
		track.addEventListener('scroll', () => {
			update();
			clearTimeout(settle);
			settle = setTimeout(wrap, 140);
		}, { passive: true });
		if (loop) {
			measure();
			jump(home());
			window.addEventListener('resize', () => {
				const off = track.scrollLeft - home();
				measure();
				jump(home() + ((off % setW) + setW) % setW);
			});
		}
		window.addEventListener('resize', update);
		update();

		let x0 = 0;
		let s0 = 0;
		let moved = false;
		track.addEventListener('pointerdown', (e) => {
			if (e.pointerType !== 'mouse') return;
			x0 = e.clientX;
			s0 = track.scrollLeft;
			moved = false;
			const move = (ev) => {
				const dx = ev.clientX - x0;
				if (Math.abs(dx) > 5) {
					moved = true;
					track.classList.add('is-drag');
				}
				track.scrollLeft = s0 - dx;
			};
			const up = () => {
				window.removeEventListener('pointermove', move);
				window.removeEventListener('pointerup', up);
				track.classList.remove('is-drag');
				const w = step();
				track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: 'smooth' });
			};
			window.addEventListener('pointermove', move);
			window.addEventListener('pointerup', up);
		});
		track.addEventListener('click', (e) => {
			if (moved) {
				e.preventDefault();
				e.stopPropagation();
				moved = false;
			}
		}, true);

		track.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowRight') next?.click();
			if (e.key === 'ArrowLeft') prev?.click();
		});

		// Autoplay, paused on hover, focus, touch and while offscreen.
		const delay = parseInt(root.dataset.autoplay, 10);
		if (delay && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
			let timer = 0;
			let hold = false;
			let visible = false;
			const stop = () => clearInterval(timer);
			const start = () => {
				stop();
				if (!hold && visible) timer = setInterval(() => track.scrollBy({ left: step(), behavior: 'smooth' }), delay);
			};
			const pause = (v) => () => { hold = v; start(); };
			root.addEventListener('pointerenter', pause(true));
			root.addEventListener('pointerleave', pause(false));
			root.addEventListener('focusin', pause(true));
			root.addEventListener('focusout', pause(false));
			track.addEventListener('touchstart', pause(true), { passive: true });
			track.addEventListener('touchend', () => setTimeout(pause(false), 2500), { passive: true });
			new IntersectionObserver(([en]) => { visible = en.isIntersecting; start(); }).observe(root);
			document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
		}
	};

	document.querySelectorAll('[data-slider]').forEach(init);
})();
