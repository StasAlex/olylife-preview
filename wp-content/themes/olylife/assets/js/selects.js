jQuery(($) => {
	const enhance = () => {
		$('main select').not('.select2-hidden-accessible, #rating').each(function () {
			$(this).selectWoo({
				width: '100%',
				label: this.getAttribute('aria-label') || this.labels?.[0]?.textContent || null,
				required: this.required || null,
				minimumResultsForSearch: 8,
				dropdownCssClass: 'olylife-select-dropdown',
				language: {
					noResults: () => 'Ничего не найдено',
					searching: () => 'Поиск…',
				},
			});
		});
	};
	enhance();
	$(document.body).on('country_to_state_changed updated_checkout updated_wc_div', enhance);
});
