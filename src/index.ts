import _Popup from '../packages/Popup.vue'
import { ANIMATION_TYPES, AnimationType } from './CONSTANTS'
import { typeOf, deepClone } from './utils'
import PACKAGE_JSON from '../package.json'
import type Vue from 'vue'
import type { Component, PluginFunction, VueConstructor } from 'vue'

type VuePopupInstall = (_Popup: typeof Popup, Vue: VueConstructor) => void

export type VuePopupPlugin = {
	name: string
	install: VuePopupInstall
}

export type VuePopupOptions = {
	zIndex?: number
}

export type VuePopupRenderOptions = {
	mask?: boolean
	maskClickClose?: boolean
	component: Component
	componentProps?: Record<string, any>
	maskAnimations?: Array<AnimationType>
	viewAnimations?: Array<AnimationType>
	animationDuration?: number
	width?: string | number
	maxWidth?: string | number
	minWidth?: string | number
	height?: string | number
	maxHeight?: string | number
	minHeight?: string | number
	mounted?: (instance: Vue) => void
	destroyed?: (payload?: any) => void
	zIndex?: number
}

export declare class VuePopup {
	static get version(): string
	static get plugins(): Array<VuePopupPlugin>
	static install: PluginFunction<void>
	constructor(options: VuePopupOptions)
	render(options: VuePopupRenderOptions): () => void
}

type PopupInstance = {
	id: string
	instance?: InstanceType<VueConstructor>
}

const plugins: Record<string, VuePopupInstall> = {}

let _Vue: VueConstructor, rootVm: Vue

class Popup implements VuePopup {
	static get version() {
		return PACKAGE_JSON.version
	}
	static get plugins() {
		return plugins
	}
	static get ANIMATION_TYPES() {
		return deepClone(ANIMATION_TYPES)
	}
	static _usePlugin({ name, install }: VuePopupPlugin) {
		this.plugins[name] = install

		install(Popup, _Vue)
	}
	static install(Vue: VueConstructor) {
		_Vue = Vue

		_Vue.mixin({
			created() {
				if (rootVm) return
				rootVm = (this as any).$root
			}
		})
	}
	static use(plugin: VuePopupPlugin) {
		if (!plugin) return

		if (!_Vue)
			throw new Error(
				'Popup should be installed by Vue before install plugins'
			)

		if (this.plugins[plugin.name])
			throw new Error(`Popup: exist plugin name: ${plugin.name}`)

		if (typeOf(plugin.install) !== 'Function')
			throw new Error(`Popup: plugin's prop install must be a function`)

		this._usePlugin(plugin)
	}
	private _seed = 0
	private _zIndex: number
	private _popups: Record<string, PopupInstance> = {}
	get seed() {
		return this._seed++
	}
	get zIndex() {
		return this._zIndex++
	}
	get popups() {
		return this._popups
	}
	constructor({ zIndex = 1000 } = {} as VuePopupOptions) {
		if (!_Vue)
			throw new Error(
				'Popup should be installed by Vue before new Popup()'
			)

		this._seed = 0
		this._zIndex = zIndex
		this._popups = {}
	}
	_destroy(popup: PopupInstance) {
		if (!this.popups[popup.id]) return

		const { instance } = popup

		if (!instance) return
		;(instance as any).destroy()
	}
	render(
		{
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
			mounted,
			destroyed
		} = {} as VuePopupRenderOptions
	) {
		const el = document.body.appendChild(document.createElement('div'))
		const Constructor = _Vue.extend(Object.assign({}, _Popup, { rootVm }))
		const instance = new Constructor({
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

		const popup: PopupInstance = {
			id: `styzy-vue-popup-${this.seed}`,
			instance
		}

		this.popups[popup.id] = popup

		instance.$on('mounted', () => {
			mounted?.call(null, instance)
		})

		instance.$on('destroyed', (payload: any) => {
			destroyed?.call(null, payload)

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
