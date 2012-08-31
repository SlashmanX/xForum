var	mongoose	=	require('mongoose');
var	Schema		=	mongoose.Schema;

var	roleSchema = new Schema({
	name: String,
	permissions: []
});

module.exports = mongoose.model('Role', roleSchema);
