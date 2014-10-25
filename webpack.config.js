module.exports = {
	entry: './src/common/background.js',
	output: {
		path: 'src/common',
		filename: 'background.built.js'
	},
	module: {
		loaders: [
			{test: /\.json$/, loader: 'json-loader'}
		],
		noParse: /fnmatch/
	},
	resolve: {
		root: process.cwd(),
		alias: {
			fs: 'src/common/fs-http.js'
		}
	}
};