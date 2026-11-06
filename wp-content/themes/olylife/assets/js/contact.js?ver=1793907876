(() => {
	document.querySelectorAll('[data-lead]').forEach((card) => {
		const form = card.querySelector('form');
		const channel = form.querySelector('[name="channel"]');
		const error = document.createElement('p');
		error.className = 'form-error';
		error.setAttribute('role', 'alert');
		form.append(error);

		// Single-choice channel chips.
		form.querySelectorAll('[data-channel]').forEach((chip) => {
			chip.addEventListener('click', () => {
				form.querySelectorAll('[data-channel]').forEach((c) => c.setAttribute('aria-checked', String(c === chip)));
				channel.value = chip.dataset.channel;
			});
		});

		// Send lead via admin-ajax.
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const phone = form.querySelector('[name="phone"]');
			if (!phone.value.trim()) {
				phone.focus();
				return;
			}
			const data = new FormData(form);
			data.append('action', 'olylife_lead');
			data.append('nonce', window.olylifeLead?.nonce || '');
			const btn = form.querySelector('[type="submit"]');
			btn.disabled = true;
			error.textContent = '';
			try {
				const res = await fetch(window.olylifeLead?.url, { method: 'POST', body: data });
				const result = await res.json();
				if (!res.ok || !result.success) throw new Error(result.data?.message || 'Не удалось отправить заявку. Попробуйте позже.');
				card.classList.add('is-sent');
			} catch {
				error.textContent = 'Не удалось отправить заявку. Проверьте соединение и попробуйте позже.';
			} finally {
				btn.disabled = false;
			}
		});
	});
})();
