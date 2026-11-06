(() => {
	// Static demo: route cart actions to the cart page and block form submits.
	const root = document.currentScript.src.replace(/demo\.js.*$/, '');
	const isEn = location.pathname.includes('/en/');
	const cart = root + (isEn ? 'en/' : '') + 'cart/index.html';
	const msg = isEn ? 'This is a static preview — forms and payments are disabled.' : 'Это демо-версия сайта — формы и оплата отключены.';
	document.addEventListener('click', (e) => {
		const a = e.target.closest('.add_to_cart_button, .single_add_to_cart_button, .cd-remove, .product-remove a, [name="apply_coupon"], .co-coupon-apply');
		if (!a) return;
		e.preventDefault();
		e.stopImmediatePropagation();
		if (a.matches('.add_to_cart_button, .single_add_to_cart_button')) location.href = cart;
		else alert(msg);
	}, true);
	document.addEventListener('submit', (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		alert(msg);
	}, true);
	document.addEventListener('click', (e) => {
		if (e.target.closest('#place_order')) {
			e.preventDefault();
			e.stopImmediatePropagation();
			alert(msg);
		}
	}, true);
})();
