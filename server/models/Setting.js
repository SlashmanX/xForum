var	mongoose	=	require('mongoose');
var	Schema		=	mongoose.Schema;
var	ObjectId	=	Schema.ObjectId;

var	settingsSchema = new Schema({
    dbName: {type: String, required: true},
    displayName: {type: String, required: true},
    description: {type: String, required: true},
    value: {type: String, required: true}
});

module.exports = mongoose.model('Setting', settingsSchema);
