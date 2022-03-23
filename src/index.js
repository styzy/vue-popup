import _Popup from '../packages/Popup.vue'

const version = '0.3.1'
class Popup {
	constructor({ zIndex = 1000 } = {}) {
		this._seed = 0
		this._zIndex = zIndex || 1000
		this._popups = {}
		window.popups = this._popups
		this._PopupConstructor = Popup.Vue.extend(_Popup)
	}
	_getZIndex() {
		const zIndex = this._zIndex
		this._zIndex += 2
		return zIndex
	}
	_createId() {
		return `styzy-vue-popup-${this._seed++}`
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
	_destroy(popup) {
		if (!this._popups[popup.id]) return

		const { instance } = popup

		if (!instance) return

		instance.destroy()
	}
	render({
		mask = true,
		maskClickClose = false,
		component,
		componentProps,
		animationDuration = 100,
		width = 'auto',
		maxWidth = 'auto',
		minWidth = 'auto',
		height = 'auto',
		maxHeight = 'auto',
		minHeight = 'auto',
		mounted = () => {},
		destroyed = () => {}
	} = {}) {
		const options = {
			mask,
			maskClickClose,
			component,
			componentProps,
			animationDuration,
			width,
			maxWidth,
			minWidth,
			height,
			maxHeight,
			minHeight
		}
		const popup = this._create(),
			instance = new this._PopupConstructor({
				propsData: Object.assign({}, options, {
					Vue: Popup.Vue,
					zIndex: this._getZIndex(),
					originConfig: options
				})
			})

		instance.$on('mounted', () => {
			mounted && mounted(instance)
		})

		instance.$on('destroyed', payload => {
			destroyed && destroyed(payload)

			const parentNode = instance.$el.parentNode

			if (parentNode) {
				parentNode.removeChild(instance.$el)
			}

			delete this._popups[popup.id]
		})

		const el = document.createElement('div')
		document.body.appendChild(el)

		instance.$mount(el)

		popup.instance = instance

		return () => {
			this._destroy(popup)
		}
	}
}

Popup.install = function (Vue) {
	Vue.component(_Popup.name, _Popup)
	Popup.Vue = Vue
}

Popup.version = version

export default Popup
