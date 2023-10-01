import process from "node:process"
import * as r from "rambdax"
import _ from "lodash"
import f from "lodash/fp"

const isDebug = process.env.DEBUG

type Fn = (...args: any[]) => any

const reduce = (fns: Fn[]) => (stdinJson: any) =>
	r.reduce((acc, fn) => fn(acc, stdinJson), stdinJson, fns)

const parse = (stdinJson: string): any => {
	try {
		return JSON.parse(stdinJson)
	} catch (error) {
		if (isDebug) {
			console.error(error)
		}

		throw new Error("Failed to parse incoming JSON")
	}
}

const evalFn = (fn: string): Fn | Fn[] => {
	try {
		return eval(`(r, _, f) => ${fn}`)(r, _, f)
	} catch (error) {
		if (isDebug) {
			console.error(error)
		}

		throw new Error("Failed to parse the input function expression")
	}
}

const reduceFnList = (fn: Fn[] | Fn): Fn => {
	try {
		if (Array.isArray(fn)) {
			return reduce(fn)
		}

		return fn
	} catch (error) {
		if (isDebug) {
			console.error(error)
		}

		throw new Error(
			"Failed construct the recursive function from input expression",
		)
	}
}

export function main(expressions: string[], stdinJson: string) {
	stdinJson = parse(stdinJson)

	const fns = reduceFnList(r.map(r.pipe(evalFn, reduceFnList), expressions))

	try {
		return fns(stdinJson)
	} catch (error) {
		if (isDebug) {
			console.error(error)
		}

		throw new Error("Failed run the function against the input object")
	}
}
