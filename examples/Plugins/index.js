export default {
	name: 'Test',
	install(Popup, Vue) {
		console.log('plugin install ')
		console.log('Popup: ', Popup)
		console.log('Vue: ', Vue)
	}
}
