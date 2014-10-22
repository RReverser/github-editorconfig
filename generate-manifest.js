var fs = require('fs');
var pkg = require('./package.json');

var manifest = {};

['name', 'version', 'description'].forEach(function (name) {
	manifest[name] = pkg[name];
});

Object.keys(pkg.kango).forEach(function (name) {
	manifest[name] = pkg.kango[name];
});

manifest.creator = pkg.author;
manifest.homepage_url = pkg.homepage;

fs.writeFileSync('src/common/extension_info.json', JSON.stringify(manifest, null, 4));
