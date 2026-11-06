(() => {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Mouse tilt for the hero card fan.
	const hero = document.querySelector('[data-tilt]');
	const target = hero?.querySelector('[data-tilt-target]');
	if (hero && target && !reduce && window.matchMedia('(hover: hover)').matches) {
		hero.addEventListener('mousemove', (e) => {
			const r = hero.getBoundingClientRect();
			const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
			const my = ((e.clientY - r.top) / r.height) * 2 - 1;
			target.style.transform = `perspective(1400px) rotateY(${mx * 9}deg) rotateX(${-my * 6}deg) translate(${mx * 14}px, ${my * 10}px)`;
		});
		hero.addEventListener('mouseleave', () => {
			target.style.transform = '';
		});
	}

	// Need picker tabs with arrow-key navigation.
	document.querySelectorAll('[data-picker]').forEach((picker) => {
		const tabs = [...picker.querySelectorAll('[role="tab"]')];
		const dots = picker.querySelector('.picker-dots');
		let panel = null;

		// Mobile: dots mirror the swipe position inside the active panel.
		const paintDots = () => {
			if (!dots || !panel) return;
			const items = [...panel.querySelectorAll('.picker-photo, .picker-grid > *')];
			if (dots.children.length !== items.length) dots.innerHTML = items.map(() => '<i></i>').join('');
			const w = items[1] ? items[1].offsetLeft - items[0].offsetLeft : 1;
			const i = Math.round(panel.scrollLeft / w);
			[...dots.children].forEach((d, n) => d.classList.toggle('is-on', n === i));
		};

		const select = (tab) => {
			tabs.forEach((t) => {
				const on = t === tab;
				t.setAttribute('aria-selected', String(on));
				t.tabIndex = on ? 0 : -1;
				const p = picker.querySelector('#' + t.getAttribute('aria-controls'));
				p.hidden = !on;
				if (on) panel = p;
			});
			panel.scrollLeft = 0;
			panel.classList.remove('is-switch');
			void panel.offsetWidth;
			panel.classList.add('is-switch');
			tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
			dots.innerHTML = '';
			paintDots();
		};

		picker.querySelectorAll('[role="tabpanel"]').forEach((p) => {
			p.addEventListener('scroll', paintDots, { passive: true });
			if (!p.hidden) panel = p;
		});
		paintDots();
		tabs.forEach((tab, i) => {
			tab.addEventListener('click', () => select(tab));
			tab.addEventListener('keydown', (e) => {
				const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
				if (!dir) return;
				const next = tabs[(i + dir + tabs.length) % tabs.length];
				select(next);
				next.focus();
			});
		});
	});
})();

(() => {
	// Expanding video panels: muted preview on hover, sound on play button.
	const reel = document.querySelector('[data-vreel]');
	if (!reel) return;
	const items = [...reel.querySelectorAll('.vreel-item')];
	const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
	const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
	let inView = false;

	const reset = (it) => {
		const v = it.querySelector('video');
		it.classList.remove('is-sound');
		v.controls = false;
		v.muted = true;
		v.pause();
	};
	const preview = (it) => {
		const v = it.querySelector('video');
		if (!fine || calm || !inView || it.classList.contains('is-sound')) return;
		v.preload = 'auto';
		v.play().catch(() => {});
	};
	const activate = (it) => {
		if (it.classList.contains('is-active')) return;
		items.forEach((o) => {
			if (o !== it) {
				o.classList.remove('is-active');
				reset(o);
			}
		});
		it.classList.add('is-active');
		preview(it);
	};

	items.forEach((it) => {
		const v = it.querySelector('video');
		if (fine) it.addEventListener('pointerenter', () => activate(it));
		it.addEventListener('focusin', () => activate(it));
		const playSound = () => {
			items.forEach((o) => o !== it && reset(o));
			activate(it);
			it.classList.add('is-sound');
			v.muted = false;
			v.controls = true;
			v.currentTime = 0;
			v.play().catch(() => {});
		};
		// Click on the active panel plays with sound; on an inactive one it opens it first.
		it.addEventListener('click', (e) => {
			if (it.classList.contains('is-sound')) return;
			if (e.target.closest('.vreel-play') || it.classList.contains('is-active')) playSound();
			else activate(it);
		});
		it.addEventListener('keydown', (e) => {
			if ((e.key === 'Enter' || e.key === ' ') && e.target === it) {
				e.preventDefault();
				playSound();
			}
		});
	});

	new IntersectionObserver(([en]) => {
		inView = en.isIntersecting;
		const cur = reel.querySelector('.is-active');
		if (!inView) items.forEach(reset);
		else if (cur) preview(cur);
	}, { threshold: .3 }).observe(reel);
})();
