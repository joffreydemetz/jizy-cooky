export function extend(...args) {
	return Object.assign({}, ...args);
}

export function isPlainObject(obj) {
	return obj && typeof obj === 'object' && obj.constructor === Object;
}

export function arrayUnique(inputArr) {
	return [...new Set(inputArr)];
}
