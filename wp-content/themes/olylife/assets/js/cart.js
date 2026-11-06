(($) => {
	// Auto-update cart on quantity change and auto-apply coupon on change.
	let timer;

	const submit = (name) => {
		const $btn = $(`.woocommerce-cart-form :input[name="${name}"]`);
		if (!$btn.length) return;
		$btn.prop('disabled', false).trigger('click');
	};

	$(document).on('change', '.woocommerce-cart-form .qty', () => {
		clearTimeout(timer);
		timer = setTimeout(() => submit('update_cart'), 450);
	});

	$(document).on('change', '.woocommerce-cart-form #coupon_code', function () {
		if (this.value.trim()) submit('apply_coupon');
	});
})(jQuery);
