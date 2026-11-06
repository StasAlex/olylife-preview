(() => {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	const timeline = CSS.supports('animation-timeline: view()');

	// Muted autoplay for decorative videos, paused offscreen.
	const vids = document.querySelectorAll('video[data-bg]');
	const vio = new IntersectionObserver((entries) => {
		entries.forEach(({ target, isIntersecting }) => {
			if (reduce) return;
			if (isIntersecting) target.play()?.catch(() => {});
			else target.pause();
		});
	}, { rootMargin: '200px' });
	vids.forEach((v) => {
		v.muted = true;
		if (reduce) v.removeAttribute('autoplay');
		vio.observe(v);
	});

	// Reveal fallback when scroll timelines are unsupported.
	if (!timeline && !reduce) {
		document.documentElement.classList.add('io-reveal');
		const io = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add('is-in');
					io.unobserve(e.target);
				}
			});
		}, { threshold: .15 });
		document.querySelectorAll('.rv, .rvs, .clip, .line, .words').forEach((el) => io.observe(el));
	}

	// Split statement text into words for scroll highlight.
	document.querySelectorAll('[data-words]').forEach((el) => {
		el.classList.add('words');
		el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span style="--i:${i}">${w}</span>`).join(' ');
	});

	// Split text into letters and light them one by one with scroll progress.
	document.querySelectorAll('[data-chars]').forEach((el) => {
		const text = el.textContent.trim();
		const sr = document.createElement('span');
		sr.className = 'screen-reader-text';
		sr.textContent = text;
		const box = document.createElement('span');
		box.setAttribute('aria-hidden', 'true');
		box.innerHTML = text.split(/\s+/).map((w) => `<span class="w">${[...w].map((c) => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ');
		el.replaceChildren(sr, box);
		const chars = [...box.querySelectorAll('.ch')];
		if (reduce) {
			chars.forEach((c) => c.classList.add('is-lit'));
			return;
		}
		let lit = -1;
		let ticking = false;
		const paint = () => {
			ticking = false;
			const r = el.getBoundingClientRect();
			const vh = innerHeight;
			const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .4)));
			const n = Math.round(p * chars.length);
			if (n === lit) return;
			lit = n;
			chars.forEach((c, i) => {
				c.classList.toggle('is-lit', i < n - 3);
				c.classList.toggle('is-edge', i >= n - 3 && i < n);
			});
		};
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(paint);
			}
		};
		new IntersectionObserver(([en]) => {
			if (en.isIntersecting) addEventListener('scroll', onScroll, { passive: true });
			else removeEventListener('scroll', onScroll);
			paint();
		}).observe(el);
	});

	// Count-up numbers.
	const cio = new IntersectionObserver((entries) => {
		entries.forEach(({ target, isIntersecting }) => {
			if (!isIntersecting) return;
			cio.unobserve(target);
			const to = parseFloat(target.dataset.count);
			const fmt = (n) => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
			if (reduce) {
				target.textContent = fmt(to) + (target.dataset.suffix || '');
				return;
			}
			const t0 = performance.now();
			const tick = (t) => {
				const k = Math.min(1, (t - t0) / 1600);
				target.textContent = fmt(to * (1 - Math.pow(1 - k, 3))) + (target.dataset.suffix || '');
				if (k < 1) requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		});
	}, { threshold: .6 });
	document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));

	if (reduce || !fine) return;

	// Mouse parallax: children with data-depth follow the pointer inside [data-mouse].
	document.querySelectorAll('[data-mouse]').forEach((zone) => {
		const layers = zone.querySelectorAll('[data-depth]');
		let raf = 0;
		zone.addEventListener('mousemove', (e) => {
			const r = zone.getBoundingClientRect();
			const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
			const my = ((e.clientY - r.top) / r.height) * 2 - 1;
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				layers.forEach((l) => {
					const d = parseFloat(l.dataset.depth);
					l.style.transform = `translate3d(${mx * d}px, ${my * d * .75}px, 0)`;
				});
			});
		});
		zone.addEventListener('mouseleave', () => layers.forEach((l) => { l.style.transform = ''; }));
	});

	// 3D tilt on hover for cards with data-tilt-card.
	document.querySelectorAll('[data-tilt-card]').forEach((card) => {
		card.addEventListener('mousemove', (e) => {
			const r = card.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width - .5;
			const y = (e.clientY - r.top) / r.height - .5;
			card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
			card.style.setProperty('--gx', `${(x + .5) * 100}%`);
			card.style.setProperty('--gy', `${(y + .5) * 100}%`);
		});
		card.addEventListener('mouseleave', () => { card.style.transform = ''; });
	});

	// Magnetic buttons.
	document.querySelectorAll('.btn--magnet').forEach((b) => {
		b.addEventListener('mousemove', (e) => {
			const r = b.getBoundingClientRect();
			b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
		});
		b.addEventListener('mouseleave', () => { b.style.transform = ''; });
	});

	// Cursor bubble that follows the mouse inside [data-cursor].
	document.querySelectorAll('[data-cursor]').forEach((zone) => {
		const dot = document.createElement('span');
		dot.className = 'cursor-bubble';
		dot.setAttribute('aria-hidden', 'true');
		dot.textContent = zone.dataset.cursor;
		zone.append(dot);
		zone.addEventListener('mousemove', (e) => {
			const r = zone.getBoundingClientRect();
			dot.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) scale(1)`;
		});
		zone.addEventListener('mouseleave', () => {
			dot.style.transform += ' scale(0)';
		});
	});
})();

(() => {
	// Track pointer entry point so button fills grow from the cursor.
	const sel = '.btn, .sl-btn, .chip, .picker-tab, .hd-cart, .hd-burger, .shop-categories a, .woocommerce-tabs .tabs a, .button, .wc-block-components-button';
	const setOrigin = (e) => {
		const el = e.target.closest?.(sel);
		if (!el) return;
		const r = el.getBoundingClientRect();
		el.style.setProperty('--x', `${e.clientX - r.left}px`);
		el.style.setProperty('--y', `${e.clientY - r.top}px`);
	};
	document.addEventListener('pointerover', setOrigin, { passive: true });
	document.addEventListener('pointerout', setOrigin, { passive: true });
})();
