import * as _ from "../index"
import "mocha";
import { assert } from "chai"

describe("map", () => {
    it("array", () => {
        const result = Array.from(_.map([1, 2, 3], x => x * x))
        assert.deepEqual([1, 4, 9], result)
    })
})

describe("filter", () => {
    it("array", () => {
        const result = Array.from(_.filter([1, 2, 3, 4], x => x % 2 === 0))
        assert.deepEqual([2, 4], result)
    })
})

describe("filterMap", () => {
    it("array", () => {
        const result = Array.from(_.filterMap([1, 2, 3, 4], x => x))
        assert.deepEqual([2, 4], result)
    })
})

describe("flatten", () => {
    it("array", () => {
        const result = Array.from(_.flatten([[1, 2], [2, 3], [3, 4]]))
        assert.deepEqual([1, 2, 2, 3, 3, 4], result)
    })
})

describe("flatMap", () => {
    it("array", () => {
        const result = Array.from(_.flatMap([1, 2, 3], x => [x, x * 2]))
        assert.deepEqual([1, 2, 2, 4, 3, 6], result)
    })
})

describe("groupBy", () => {
    it("array", () => {
        const m = _.map([1, 2, 3, 1, 3, 2, 3, 3], x => _.nameValue(x.toString(), 1))
        const result = _.groupBy(m, (a, b) => a + b)
        assert.deepEqual({ 1: 2, 2: 2, 3: 4 }, result)
    })
})

describe("values", () => {
    it("array", () => {
        const result = Array.from(_.values({ 1: 2, 2: 2, 3: 3 }))
        assert.deepEqual([2, 2, 3], result)
    })
    it("array with undefined", () => {
        const x: { [name: string]: number|undefined } = { 1: 2, 2: 4, t: undefined }
        const result: number[] = Array.from(_.values(x))
        assert.deepEqual([2, 4], result)
    })
})

describe("entries", () => {
    it("array", () => {
        const x: { [name: string]: number } = { 1: 2, 2: 2, 3: 3 }
        const result = Array.from(_.entries(x))
        assert.deepEqual([["1", 2], ["2", 2], ["3", 3]], result)
    })
    it("array with undefined", () => {
        const x: { [name: string]: number|undefined } = { 1: 2, 2: 2, t: undefined }
        const result = Array.from(_.entries(x))
        assert.deepEqual([["1", 2], ["2", 2]], result)
    })
})

describe("repeat", () => {
    it("array", () => {
        const result = Array.from(_.repeat("Hello!", 5))
        assert.deepEqual(["Hello!", "Hello!", "Hello!", "Hello!", "Hello!"], result)
    })
})

describe("zip", () => {
    it("array", () => {
        const result = Array.from(_.zip([1, "b"], ["a", 2]))
        assert.deepEqual([[1, "a"], ["b", 2]], result)
    })
})

describe("generate", () => {
    it("infinite", () => {
        const result = Array.from(_.zip(_.repeat(2), [1, 3]))
        assert.deepEqual([[2, 1], [2, 3]], result)
    })
})

describe("reduce", () => {
    it("no items", () => {
        const result = _.reduce([], a => a)
        assert.isUndefined(result)
    })
    it("1", () => {
        const result = _.reduce([1], (a, b) => a + b)
        if (result === undefined) {
            throw new Error("undefined")
        }
        assert.equal(1, result)
    })
})

describe("sum", () => {
    it("array", () => {
        const result = _.sum([1, 2, 3])
        assert.equal(6, result)
    })
})

describe("min", () => {
    it("3", () => {
        const result = _.min([1, 2, 3])
        assert.equal(1, result)
    })
    it("0", () => {
        const result = _.min([])
        assert.equal(Infinity, result)
    })
})

describe("max", () => {
    it("3", () => {
        const result = _.max([1, 2, 3])
        assert.equal(3, result)
    })
    it("0", () => {
        const result = _.max([])
        assert.equal(-Infinity, result)
    })
})

describe("toObject", () => {
    it("toObject", () => {
        const result = _.toObject([["a", 2], ["b", 4]])
        assert.deepEqual({ a: 2, b: 4 }, result)
    })
})
