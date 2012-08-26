var	lessMiddleware	=	require('less-middleware');

module.exports = function(app, exp) {

	app.configure(function(){
		app.set('views', app.root + '/server/views');
		app.set('view engine', 'jade');
		app.set('view options', { doctype : 'html', pretty : true });
		app.use(exp.bodyParser());
		app.use(exp.cookieParser());
		app.use(exp.session({ secret: 'I am not wearing any pants' }));
		app.use(exp.methodOverride());
		app.use(lessMiddleware({
	        src: app.root + '/public'
	    }));
		app.use(exp.static(app.root + '/server'));
		app.use(exp.static(app.root + '/public'));

		
	});
	
}