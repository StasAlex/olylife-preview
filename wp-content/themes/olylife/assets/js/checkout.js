(($) => {
	// Collapsible checkout steps with smooth height and "continue" buttons.
	const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

	const toggle = (d, open) => {
		if (d.open === open) return;
		const sum = d.querySelector('summary');
		if (calm) {
			d.open = open;
			return;
		}
		const from = d.offsetHeight;
		if (open) d.open = true;
		const to = open ? d.scrollHeight : sum.offsetHeight;
		d._anim?.cancel();
		d._anim = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
		d._anim.onfinish = () => {
			if (!open) d.open = false;
			d._anim = null;
		};
	};

	$(document).on('click', '.co-step-head', function (e) {
		e.preventDefault();
		const d = this.parentElement;
		toggle(d, !d.open);
	});

	const msg = (window.olylifeCheckout && olylifeCheckout.i18n) || {};

	// Validates visible fields inside a step and adds inline error messages.
	const validateStep = (d) => {
		const $rows = $(d).find('.form-row').filter(':visible');
		$rows.find('.input-text, select, input:checkbox').trigger('validate');
		$rows.filter('.validate-required').each(function () {
			const $input = $(this).find('input.input-text, select, textarea, input:checkbox').first();
			if (!$input.length) return;
			const empty = $input.is(':checkbox') ? !$input.is(':checked') : !String($input.val() || '').trim();
			if (empty) $(this).removeClass('woocommerce-validated').addClass('woocommerce-invalid woocommerce-invalid-required-field');
		});
		const $bad = $rows.filter('.woocommerce-invalid');
		$bad.each(function () {
			const $row = $(this);
			$row.find('.checkout-inline-error-message').remove();
			let text = msg.required;
			if ($row.hasClass('woocommerce-invalid-email')) text = msg.email;
			else if ($row.hasClass('woocommerce-invalid-phone')) text = msg.phone;
			$('<p class="checkout-inline-error-message"></p>').text(text || '').appendTo($row);
		});
		return $bad;
	};

	const focusFirst = ($bad) => {
		const row = $bad[0];
		if (!row) return;
		row.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
		row.querySelector('input.input-text, textarea')?.focus({ preventScroll: true });
	};

	$(document).on('click', '[data-co-next]', function () {
		const d = this.closest('.co-step');
		const $bad = validateStep(d);
		if ($bad.length) {
			focusFirst($bad);
			return;
		}
		const next = $(d).nextAll('.co-step')[0];
		toggle(d, false);
		if (!next) return;
		toggle(next, true);
		setTimeout(() => next.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' }), 120);
	});

	// Apply coupon from the sidebar field without the separate coupon form.
	const applyCoupon = () => {
		const $box = $('[data-co-coupon]');
		const $input = $box.find('input');
		const code = $input.val().trim();
		if (!code || $box.hasClass('is-busy') || typeof wc_checkout_params === 'undefined') return;
		$box.addClass('is-busy');
		$.post(wc_checkout_params.wc_ajax_url.replace('%%endpoint%%', 'apply_coupon'), {
			security: wc_checkout_params.apply_coupon_nonce,
			coupon_code: code,
		}).done((html) => {
			$box.find('.co-coupon-notice').html(html);
			if (!/woocommerce-error/.test(html)) $input.val('');
			$(document.body).trigger('applied_coupon_in_checkout', [code]).trigger('update_checkout', { update_shipping_method: false });
		}).always(() => $box.removeClass('is-busy'));
	};

	$(document).on('click', '[data-co-coupon-apply]', applyCoupon);
	$(document).on('keydown', '#co_coupon_code', (e) => {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		applyCoupon();
	});

	// Validate every step before placing the order.
	$('form.checkout').on('checkout_place_order', () => {
		let $all = $();
		document.querySelectorAll('.co-step').forEach((d) => {
			d._anim?.cancel();
			d.open = true;
			$all = $all.add(validateStep(d));
		});
		if (!$all.length) return true;
		focusFirst($all);
		return false;
	});

	$(document.body).on('checkout_error', () => {
		document.querySelectorAll('.co-step').forEach((d) => {
			if (d.querySelector('.woocommerce-invalid')) toggle(d, true);
		});
	});
})(jQuery);
