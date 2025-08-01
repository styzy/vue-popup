const path = require('path')

module.exports = {
	pages: {
		index: {
			entry: 'examples/main.js',
			template: 'public/index.html',
			filename: 'index.html'
		}
	},
	chainWebpack: config => {
		config.resolve.alias
			.set('@', path.resolve('src'))
			.set('#', path.resolve('src/utils'))
			.set('@ex', path.resolve('examples'))
		config.module
			.rule('js')
			.include.add('/packages')
			.end()
			.use('babel')
			.loader('babel-loader')
	},
	runtimeCompiler: true,
	configureWebpack: {
		output: {
			libraryExport: 'default'
		}
	},
	css: {
		extract: false
	}
}
