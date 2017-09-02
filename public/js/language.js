window.i18next.use(i18nextXHRBackend)
.init({

	lng: 'th',
	debug: true,
	backend: {

		loadPath: '/locales/{{lng}}.json'
	}
}, function(err, t) {

	updateContent();
});

function updateContent() {
	//$('#intro')
	 $('#intro').text(i18next.t('intro'));
	 $('#start').text(i18next.t('start'));
	//document.getElementById('intro').innerHTML = i18next.t('intro');
}

function changeLng(lng) {
	i18next.changeLanguage(lng);
}

i18next.on('languageChanged', () => {
	updateContent();
});
