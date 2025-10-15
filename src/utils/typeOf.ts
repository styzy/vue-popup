type TypeOf =
	| 'Null'
	| 'Undefined'
	| 'Object'
	| 'Array'
	| 'String'
	| 'Number'
	| 'Boolean'
	| 'Function'
	| 'Symbol'
	| 'BigInt'

export function typeOf(param: any): TypeOf {
	const result = Object.prototype.toString.call(param).match(/\s+(\w+)/)
	return result ? (result[1] as TypeOf) : 'Null'
}
