/* tslint:disable */

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
        assert.deepEqual([1, 2, 3, 4], result)
    })
    it("array with undefined", () => {
        const result: number[] = Array.from(_.filterMap([1, 2, 3, 4, undefined], x => x))
        assert.deepEqual([1, 2, 3, 4], result)
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
    it("2", () => {
        const result = _.reduce([1, 2], (a, b) => a + b)
        if (result === undefined) {
            throw new Error("undefined")
        }
        assert.equal(3, result)
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
    it("negative", () => {
        const result = _.min([-1, -2, -3])
        assert.equal(-3, result)
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
    it("negative (to make sure, no zeros are involved", () => {
        const result = _.max([-2, -3, -4])
        assert.equal(-2, result)
    })
})

describe("forEach", () => {
    it("array", () => {
        let x = 0
        let ii = 0
        _.forEach(
            [1, 2, 4],
            (v, i) => {
                x = x + v
                ii = ii + i
            })
        assert.equal(7, x)
        assert.equal(3, ii)
    })
})

describe("arrayEqual", () => {
    it("ref equal", () => {
        const ref: ReadonlyArray<string> = ["a", "b"]
        const result = _.arrayEqual(ref, ref, (a, b) => a === b)
        assert.isTrue(result)
    })
    it("equal", () => {
        const result = _.arrayEqual(["a", "b"], ["a", "b"], (a, b) => a === b)
        assert.isTrue(result)
    })
    it("undefined", () => {
        const result = _.arrayEqual(["a", "b"], undefined, (a, b) => a === b)
        assert.isFalse(result)
    })
    it("length", () => {
        const result = _.arrayEqual(["a", "b"], ["a", "b", "c"], (a, b) => a === b)
        assert.isFalse(result)
    })
    it("not equal", () => {
        const result = _.arrayEqual(["a", "b"], ["a", "c"], (a, b) => a === b)
        assert.isFalse(result)
    })
})
