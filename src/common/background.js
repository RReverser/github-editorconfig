var resolvePath = require('path').resolve;
var ec = require('editorconfig');

if (!kango.storage.getItem('editorconfig')) {
    kango.xhr.send({
        method: 'GET',
        async: true,
        url: 'res/default.editorconfig'
    }, function (data) {
        kango.storage.setItem('editorconfig', data.response);
    });
}

global.getEditorConfig = function (path, callback) {
    kango.xhr.send({
        method: 'GET',
        async: true,
        url: 'https://raw.githubusercontent.com/' + path.config
    }, function (data) {
        var config = ec.parseFromFiles(path.relative, [{
            name: resolvePath('.editorconfig'),
            contents: data.status === 200 ? data.response : kango.storage.getItem('editorconfig')
        }]);
        config.$path = path;
        callback(config);
    });
};