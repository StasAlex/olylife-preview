(() => {
	// Plus/minus stepper around WooCommerce quantity inputs.
	const sync = (wrap) => {
		const input = wrap.querySelector('.qty');
		const v = parseFloat(input.value) || 0;
		const min = parseFloat(input.min) || 0;
		const max = parseFloat(input.max) || Infinity;
		wrap.querySelector('.is-minus')?.toggleAttribute('disabled', v <= min);
		wrap.querySelector('.is-plus')?.toggleAttribute('disabled', v >= max);
	};

	document.addEventListener('click', (e) => {
		const btn = e.target.closest('.qty-btn');
		if (!btn) return;
		const wrap = btn.closest('.quantity');
		const input = wrap.querySelector('.qty');
		const step = parseFloat(input.step) || 1;
		const min = parseFloat(input.min) || 0;
		const max = parseFloat(input.max) || Infinity;
		const next = (parseFloat(input.value) || 0) + step * Number(btn.dataset.qty);
		input.value = Math.min(max, Math.max(min, next));
		input.dispatchEvent(new Event('change', { bubbles: true }));
		sync(wrap);
	});

	document.addEventListener('input', (e) => {
		if (e.target.matches('.quantity .qty')) sync(e.target.closest('.quantity'));
	});

	const init = () => document.querySelectorAll('.quantity').forEach((w) => w.querySelector('.qty') && sync(w));
	init();
	window.jQuery?.(document.body).on('updated_wc_div updated_cart_totals', init);
})();
