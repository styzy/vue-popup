import Vue from 'vue'
import _Popup from '../packages/Popup.vue'
import { ANIMATION_TYPES } from './CONSTANTS'
import { typeOf, deepClone } from './utils'

const version = '0.9.0',
	config = { propertyName: '$popup', zIndex: 1000 },
	plugins = {}

class Popup {
	static get version() {
		return version
	}
	static get plugins() {
		return plugins
	}
	static get ANIMATION_TYPES() {
		return deepClone(ANIMATION_TYPES)
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
		return this._seed++
	}
	get zIndex() {
		return this._zIndex++
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
		this._PopupConstructor = Vue.extend(_Popup)
	}
	_create() {
		const id = `styzy-vue-popup-${this.seed}`,
			popup = {
				id,
				instance: null
			}
		this.popups[id] = popup
		return popup
	}
	_destroy(popup) {
		if (!this.popups[popup.id]) return

		const { instance } = popup

		if (!instance) return

		instance.destroy()
	}
	render({
		zIndex = this.zIndex,
		mask = true,
		maskClickClose = false,
		component,
		componentProps,
		maskAnimations = [ANIMATION_TYPES.FADE],
		viewAnimations = [ANIMATION_TYPES.FADE, ANIMATION_TYPES.SCALE],
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
		const el = document.body.appendChild(document.createElement('div')),
			popup = this._create(),
			instance = new this._PopupConstructor({
				propsData: {
					key: popup.id,
					popupId: popup.id,
					mask,
					animationDuration,
					maskProps: {
						zIndex,
						maskClickClose,
						animations: maskAnimations,
						animationDuration
					},
					viewProps: {
						zIndex,
						component,
						componentProps,
						animations: viewAnimations,
						animationDuration,
						width,
						maxWidth,
						minWidth,
						height,
						maxHeight,
						minHeight
					}
				}
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

			delete this.popups[popup.id]
		})

		instance.$mount(el)

		return () => {
			this._destroy(popup)
		}
	}
}

export default Popup
