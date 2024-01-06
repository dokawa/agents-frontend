import { decamelize } from "humps"

export function createQuery(...params) {
	const queryArray = params.map((p) => {
		if (typeof p === "object") {
			const key = Object.keys(p)[0]
			return `${decamelize(key)}${createQuery(...p[key])}`
		}
		return decamelize(p)
	})
	return `{${queryArray.join(",")}}`
}
