const presets = ['@vue/cli-plugin-babel/preset']

const plugins = []

const prdPlugins = [
	[
		'babel-plugin-transform-remove-console',
		{
			exclude: ['error', 'warn']
		}
	]
]

module.exports = api => {
	api.cache(false)

	return {
		presets,
		plugins:
			process.env.NODE_ENV === 'production'
				? plugins.concat(prdPlugins)
				: plugins
	}
}
