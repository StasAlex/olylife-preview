jQuery(($) => {
	// Slide-in cart drawer fed by WooCommerce cart fragments.
	const drawer = document.querySelector('[data-cart-drawer]');
	if (!drawer) return;
	const panel = drawer.querySelector('.cd-panel');
	const $body = $(document.body);
	let lastFocus = null;

	const open = () => {
		lastFocus = document.activeElement;
		panel.inert = false;
		drawer.classList.add('is-open');
		document.documentElement.classList.add('cd-lock');
		setTimeout(() => drawer.querySelector('.cd-close')?.focus(), 50);
	};
	const close = () => {
		drawer.classList.remove('is-open');
		document.documentElement.classList.remove('cd-lock');
		panel.inert = true;
		lastFocus?.focus?.();
	};

	document.addEventListener('click', (e) => {
		if (e.target.closest('.hd-cart')) {
			e.preventDefault();
			open();
		} else if (e.target.closest('[data-cd-close]')) {
			close();
		}
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
	});

	const applyFragments = (fragments) => {
		if (!fragments) return;
		$.each(fragments, (sel, html) => $(sel).replaceWith(html));
		$body.trigger('wc_fragments_refreshed');
	};

	$body.on('added_to_cart', () => open());

	// Quantity stepper inside the drawer.
	$(drawer).on('click', '[data-cd-qty]', function () {
		const item = this.closest('.cd-item');
		const val = parseInt(item.querySelector('.cd-qty-val').textContent, 10) || 1;
		const qty = Math.max(0, val + Number(this.dataset.cdQty));
		item.classList.add('is-busy');
		$.post(olylifeCart.ajax, { action: 'olylife_cart_qty', nonce: olylifeCart.nonce, key: item.dataset.key, qty })
			.done((res) => applyFragments(res?.fragments))
			.always(() => item.classList.remove('is-busy'));
	});

	// Ajax add-to-cart for simple products on the single product page.
	$(document).on('submit', 'form.cart:not(.variations_form):not(.grouped_form)', function (e) {
		const btn = this.querySelector('[name="add-to-cart"]');
		if (!btn || typeof wc_add_to_cart_params === 'undefined') return;
		e.preventDefault();
		const $btn = $(btn).addClass('loading');
		const data = { product_id: btn.value, quantity: this.querySelector('.qty')?.value || 1 };
		$body.trigger('adding_to_cart', [$btn, data]);
		$.post(wc_add_to_cart_params.wc_ajax_url.replace('%%endpoint%%', 'add_to_cart'), data)
			.done((res) => {
				if (!res || res.error) {
					if (res?.product_url) window.location = res.product_url;
					return;
				}
				applyFragments(res.fragments);
				$body.trigger('added_to_cart', [res.fragments, res.cart_hash, $btn]);
			})
			.always(() => $btn.removeClass('loading'));
	});
});
