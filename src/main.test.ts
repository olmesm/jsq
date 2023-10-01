import { expect, test } from "bun:test"
import _countryData from "./_test/country-data.json"
import { main } from "./main.js"

const countryData: string = JSON.stringify(_countryData)

test("chains multiple inputs", () => {
	const expressions = [
		'f.map("name.common")', // get only common names
		"coll => coll.filter((_, i) => i % 2 === 0)", // divide the list by a third
		"f.takeLast(5)",
	]

	expect(main(expressions, countryData)).toEqual([
		"Hungary",
		"Iraq",
		"Lithuania",
		"Botswana",
		"Gabon",
	])
})

test("accepts multiple library references", () => {
	expect(
		main(
			['[o => _.map(o, f.get("name.common"))]', "r.takeLast(5)"],
			countryData,
		),
	).toEqual([
		"Northern Mariana Islands",
		"Botswana",
		"Panama",
		"Gabon",
		"Ecuador",
	])
})

test("passes the result and original data into function expression collections, but not between function expression collections", () => {
	expect(
		main(
			[
				`r.map((n) => String.fromCodePoint(97 + n))`,
				`[
					r.map(i => i + 1),
					(rx, o) => [...rx, ...r.map(i => i + 2)(o)],
				]`,
			],
			JSON.stringify([0, 1, 2, 3]),
		),
	).toEqual(["a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2"])
})

test.skip("allows function files", () => {
	expect(1).toBe(1)
})
