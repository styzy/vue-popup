import Vue from 'vue'
import PopupComponent from '../packages/Popup.vue'
import { typeOf } from './utils'

const version = '0.5.1',
	config = { propertyName: '$popup', zIndex: 1000 },
	plugins = {}

class Popup {
	static get version() {
		return version
	}
	static get plugins() {
		return plugins
	}
	static _usePlugin(name, install) {
		this.plugins[name] = install

		install(this)
	}
	static install(Vue) {
		try {
			const { propertyName } = config

			if (!propertyName)
				throw `Install fail. Popup config attribute propertyName is necessary.`

			if (propertyName in Vue.prototype)
				throw `Install fail. Popup config attribute propertyName as '${propertyName}' already exists in Vue prototype.`

			Vue.prototype[propertyName] = new Popup()

			Vue.component(PopupComponent.name, PopupComponent)
		} catch (error) {
			console.error(`Popup: ${error}`)
		}
	}
	static use(plugin) {
		if (!plugin) return
		const { name, install = () => {} } = plugin

		if (this.plugins[name])
			throw new Error(`Popup: exist plugin name: ${name}`)

		if (typeOf(install) !== 'Function')
			throw new Error(`Popup: plugin's prop install must be a function`)

		this._usePlugin(name, install)
	}
	static config(customConfig = {}) {
		Object.assign(config, customConfig)
	}
	get seed() {
		return this._seed
	}
	get zIndex() {
		const zIndex = this._zIndex
		this._zIndex += 2
		return zIndex
	}
	get popups() {
		return this._popups
	}
	get PopupConstructor() {
		return this._PopupConstructor
	}
	constructor() {
		const { zIndex } = config
		this._seed = 0
		this._zIndex = zIndex
		this._popups = {}
		this._PopupConstructor = Vue.extend(PopupComponent)
	}
	_create() {
		const id = `styzy-vue-popup-${this.seed}`,
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
					zIndex: this.zIndex,
					originConfig: options
				})
			})

		popup.instance = instance

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

		instance.$mount()

		document.body.appendChild(instance.$el)

		return () => {
			this._destroy(popup)
		}
	}
}

export default Popup
