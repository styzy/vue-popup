import _Popup from '../packages/Popup.vue'
import { ANIMATION_TYPES } from './CONSTANTS'
import { typeOf, deepClone } from './utils'
import PACKAGE_JSON from '../package.json'

const plugins = {}

let Vue = null,
	rootVm = null

class Popup {
	static get version() {
		return PACKAGE_JSON.version
	}
	static get plugins() {
		return plugins
	}
	static get ANIMATION_TYPES() {
		return deepClone(ANIMATION_TYPES)
	}
	static _usePlugin(name, install) {
		this.plugins[name] = install

		install(this, Vue)
	}
	static install(_Vue) {
		Vue = _Vue

		_Vue.mixin({
			created() {
				if (rootVm) return
				rootVm = this.$root
			}
		})
	}
	static use(plugin) {
		if (!plugin) return

		if (!Vue)
			throw new Error(
				'Popup should be installed by Vue before install plugins'
			)

		const { name, install = () => {} } = plugin

		if (this.plugins[name])
			throw new Error(`Popup: exist plugin name: ${name}`)

		if (typeOf(install) !== 'Function')
			throw new Error(`Popup: plugin's prop install must be a function`)

		this._usePlugin(name, install)
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
	get parentVm() {
		return this._parentVm
	}
	get PopupConstructor() {
		return this._PopupConstructor
	}
	constructor({ zIndex = 1000, parentVm } = {}) {
		if (!Vue)
			throw new Error(
				'Popup should be installed by Vue before new Popup()'
			)

		this._seed = 0
		this._zIndex = zIndex
		this._popups = {}
		this._parentVm = parentVm
		this._PopupConstructor = null
	}
	_createPopupConstructor() {
		const parent = this.parentVm || rootVm

		this._PopupConstructor = Vue.extend(
			Object.assign({}, _Popup, { parent })
		)
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
		if (!this.PopupConstructor) this._createPopupConstructor()

		const el = document.body.appendChild(document.createElement('div')),
			popup = this._create(),
			instance = new this.PopupConstructor({
				propsData: {
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
