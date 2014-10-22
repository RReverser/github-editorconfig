var resolvePath = require('path').resolve;
var ec = require('editorconfig');

window.getEditorConfig = function (path, callback) {
    kango.xhr.send({
        method: 'GET',
        async: true,
        url: 'https://raw.githubusercontent.com/' + path.config,
        contentType: 'text'
    }, function (data) {
        var config = data.status !== 200 ? {} : ec.parseFromFiles(path.relative, [{
            name: resolvePath('.editorconfig'),
            contents: data.response
        }]);
        config.$path = path;
        callback(config);
    });
};