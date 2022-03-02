import _Popup from '../packages/Popup.vue'

const version = '0.1.2'
class Popup {
	constructor({ zIndex } = { zIndex: 1000 }) {
		this._seed = 0
		this._zIndex = zIndex || 1000
		this._popups = {}
		this._PopupConstructor = Popup.Vue.extend(_Popup)
	}
	_getZIndex() {
		const zIndex = this._zIndex
		this._zIndex += 2
		return zIndex
	}
	_createId() {
		return `styzy-vue-popup-${this._seed}`
	}
	_create() {
		const id = this._createId(),
			popup = {
				id,
				instance: null
			}
		this._popups[id] = popup
		return popup
	}
	render(options = {}) {
		return new Promise(resolve => {
			const popup = this._create(),
				instance = new this._PopupConstructor({
					propsData: Object.assign({}, options, {
						Vue: Popup.Vue,
						zIndex: this._getZIndex(),
						originConfig: options
					})
				})

			instance.$on('destroyed', payload => {
				const parentNode = instance.$el.parentNode
				if (parentNode) {
					parentNode.removeChild(instance.$el)
				}
				resolve(payload)
			})

			const el = document.createElement('div')
			document.body.appendChild(el)

			instance.$mount(el)

			popup.instance = instance
		})
	}
}

Popup.install = function (Vue) {
	Vue.component(_Popup.name, _Popup)
	Popup.Vue = Vue
}

Popup.version = version

export default Popup
