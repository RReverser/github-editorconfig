var Promise = require('bluebird');
var pathUtils = require('path');
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
    var defaultConfig = ec.parseFromFiles(path.relative, [{
        name: pathUtils.resolve('.editorconfig'),
        contents: kango.storage.getItem('editorconfig') || ''
    }]);

    var repoConfig = ec.parse(pathUtils.join(path.root, path.relative), {
        root: path.root
    });

    Promise.settle([defaultConfig, repoConfig])
    .reduce(function (merged, current) {
        if (current.isFulfilled()) {
            current = current.value();
            for (var name in current) {
                merged[name] = current[name];
            }
        }
        return merged;
    }, {$path: path})
    .done(callback);
};