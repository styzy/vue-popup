import { PluginFunction } from 'vue'
import { VuePopupOptions, VuePopupPlugin, VuePopupRenderOptions } from '@/index'

export declare class VuePopup {
	static get version(): string
	static get plugins(): Array<VuePopupPlugin>
	static install: PluginFunction<void>
	constructor(options: VuePopupOptions)
	render(options: VuePopupRenderOptions): () => void
}

export default VuePopup
