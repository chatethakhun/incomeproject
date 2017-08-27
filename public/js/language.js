function updateText() {
	'use strict';
	var i18n = $.i18n(), intro, start, language;
	intro = $( '#intro' ).text();
	start = $( '#start' ).text();
	language = $( '#language option:selected' ).val();
	console.log("H1 " + intro);
	console.log("Start Button " + start);
	console.log("Language " + language);
	/*message = '$1 has $2 {{plural:$2|kitten|kittens}}. '
		+ '{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.';

	person = $( '.person option:selected' ).text();
	gender = $( '.person option:selected' ).val();
	kittens = $( '.kittens' ).val();
	test = $( '.test' ).text();;
	console.log(language);
	console.log(test);*/
	i18n.locale = language;
	i18n.load( '../json-languages/' + i18n.locale + '.json', i18n.locale ).done(
		function(e) {
			console.log(e);
			//var personName = $.i18n( person ), localizedMessage = $.i18n( message, personName,
				//kittens, gender, test );
				//console.log(personName);
				//console.log(localizedMessage);
			$( '#intro' ).text( e.intro );
			$( '#start' ).text( e.start );
		} );
}
// Enable debug
$.i18n.debug = true;

$( document ).ready( function( $ ) {
	'use strict';
	updateText();
	$( '#language' ).on( 'change keyup', updateText );
} );
