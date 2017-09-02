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
	 $( '#login' ).text( i18next.t('login') );
	 $( '#loginBtn' ).text( i18next.t('loginBtn') );
	 $('#username').attr("placeholder", i18next.t('username'));
	 $('#password').attr("placeholder", i18next.t('password'));
	 $("label[for='username']").text(i18next.t('labeluser'));
	 $("label[for='password']").text(i18next.t('labelpassword'));
	//document.getElementById('intro').innerHTML = i18next.t('intro');
}

function changeLng(lng) {
	i18next.changeLanguage(lng);
}

i18next.on('languageChanged', () => {
	updateContent();
});
