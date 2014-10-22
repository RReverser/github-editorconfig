var fs = require('fs');
var pkg = require('./package.json');

var manifest = {};

['name', 'version', 'description'].forEach(function (name) {
	manifest[name] = pkg[name];
});

Object.keys(pkg.extension_info).forEach(function (name) {
	manifest[name] = pkg.extension_info[name];
});

manifest.creator = pkg.author;
manifest.homepage_url = pkg.homepage;

fs.writeFileSync('src/common/extension_info.json', JSON.stringify(manifest, null, 4));
