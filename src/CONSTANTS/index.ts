export const enum AnimationType {
	/**
	 * 淡入淡出动画
	 */
	FADE = 'fade',
	/**
	 * 缩放动画
	 */
	SCALE = 'scale',
	/**
	 * 飞入动画
	 */
	FLY = 'fly'
}

const ANIMATION_TYPES = {
	FADE: AnimationType.FADE,
	SCALE: AnimationType.SCALE,
	FLY: AnimationType.FLY
}

export { ANIMATION_TYPES }

export default {
	ANIMATION_TYPES
}
