var resolvePath = require('path').resolve;

exports.readFile = function (path) {
	var callback = arguments[arguments.length - 1];
	kango.xhr.send({
		method: 'GET',
		async: true,
		url: 'https://raw.githubusercontent.com' + resolvePath(path)
	}, function (data) {
		if (data.status === 200) {
			callback(data.response);
		} else {
			callback(null, data.response);
		}
	});
};