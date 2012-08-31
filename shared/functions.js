(function(exports){


	exports.slugify = function(s) {
		if(s) {
			s = s.replace(/[^\w\s-]/g, '').trim().toLowerCase();
			s = s.replace(/[-\s]+/g, '-');
			console.log(s);
		}
		return s;
	}
	
})(typeof exports === 'undefined'? this['functions']={}: exports);