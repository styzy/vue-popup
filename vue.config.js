module.exports = {
	lintOnSave: false,
	chainWebpack: config => {
		config.module
			.rule('js')
			.include.add('/packages')
			.end()
			.use('babel')
			.loader('babel-loader')
	},
	devServer: {
		overlay: {
			warning: false,
			errors: false
		}
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
