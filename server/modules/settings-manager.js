var	Setting		=	require('../models/Setting.js');
var	Settings	=	{};
var	mongoose	=	require('mongoose');

module.exports = Settings;

Settings.getSettings = function(callback)
{
    Setting.find(function(err, res) {
        var settings = [];

        for(var i = 0; i < res.length; i++)
        {
            settings[res[i].dbName] = res[i].value;
        }

        callback(settings);
    })
};

Settings.add = function(newData, callback)
{
    new Setting(newData).save(callback(null));
}