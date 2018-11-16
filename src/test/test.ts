/* tslint:disable */

import * as _ from "../index"
import "mocha";
import { assert } from "chai"

describe("map", () => {
    it("array", () => {
        const result = Array.from(_.map([1, 2, 3], x => x * x))
        assert.deepEqual([1, 4, 9], result)
    })
    it("undefined", () => {
        const result = Array.from(_.map(undefined, x => x))
        assert.deepEqual([], result)
    })
})

describe("filter", () => {
    it("array", () => {
        const result = Array.from(_.filter([1, 2, 3, 4], x => x % 2 === 0))
        assert.deepEqual([2, 4], result)
    })
})

describe("drop", () => {
    it("array", () => {
        const result = Array.from(_.drop(["a", "b", "c", "d", "e"], 2))
        assert.deepEqual(["c", "d", "e"], result)
    })
    it("default", () => {
        const result = Array.from(_.drop(["a", "b", "c", "d", "e"]))
        assert.deepEqual(["b", "c", "d", "e"], result)
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
    it("undefined", () => {
        const result = Array.from(_.flatten(undefined))
        assert.deepEqual([], result)
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
        const result = Array.from(_.zip([1, "b", 4], ["a", 2, 6]))
        assert.deepEqual([[1, "a"], ["b", 2], [4, 6]], result)
    })
    it("empty item", () => {
        const result = Array.from(_.zip([1, "b"], [], ["a", 2]))
        assert.deepEqual([], result)
    })
    it("undefined", () => {
        const result = Array.from(_.zip([1, "b"], undefined, ["a", 2]))
        assert.deepEqual([], result)
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

describe("isEqual", () => {
    it("ref equal", () => {
        const ref: ReadonlyArray<string> = ["a", "b"]
        const result = _.isEqual(ref, ref, (a, b) => a === b)
        assert.isTrue(result)
    })
    it("equal", () => {
        const result = _.isEqual(["a", "b"], ["a", "b"], (a, b) => a === b)
        assert.isTrue(result)
    })
    it("length", () => {
        const result = _.isEqual(["a", "b"], ["a", "b", "c"], (a, b) => a === b)
        assert.isFalse(result)
    })
    it("not equal", () => {
        const result = _.isEqual(["a", "b"], ["a", "c"], (a, b) => a === b)
        assert.isFalse(result)
    })
    it("default e", () => {
        const result = _.isEqual(["a", "b"], ["a", "c"])
        assert.isFalse(result)
    })
    it("one undefined", () => {
        const result = _.isEqual(undefined, "a")
        assert.isFalse(result)
    })
    it("both undefined", () => {
        const result = _.isEqual(undefined, undefined)
        assert.isTrue(result)
    })
})

describe("last", () => {
    it("3", () => {
        const result = _.last([1, 4, 5, 3])
        assert.equal(3, result)
    })
    it("undefined", () => {
        const result = _.last([])
        assert.isUndefined(result)
    })
})

describe("some", () => {
    it("some", () => {
        const result = _.some([1, 2, 3, 4], v => v == 2)
        assert.isTrue(result)
    })
    it("none", () => {
        const result = _.some([1, 5, 3, 4], v => v == 2)
        assert.isFalse(result)
    })
    it("with undefined", () => {
        const result = _.some([undefined], () => true)
        assert.isTrue(result)
    })
})

function readonlyArrayOrString(v: ReadonlyArray<string>|string): ReadonlyArray<string>|string {
    return v
}

describe("isArray", () => {
    it("array", () => {
        const v = readonlyArrayOrString(["5"])
        if (_.isArray(v)) {
            assert.equal(1, v.length)
            assert.equal("5", v[0])
        } else {
            throw Error("`isArray()` returned `false`")
        }
    })
    it("array", () => {
        const v = readonlyArrayOrString("5")
        if (_.isArray(v)) {
            throw Error("`isArray()` returned `true`")

        } else {
            assert.equal("5", v)
        }
    })
})

describe("concat", () => {
    it("several", () => {
        const result = _.concat([1, 2, 3], [5, 7, 9], [-1])
        assert.deepEqual([1, 2, 3, 5, 7, 9, -1], _.toArray(result))
    })
    it("concat", () => {
        const result = _.concat([1, 2, 3], [5, 7, 9], undefined, [-1])
        assert.deepEqual([1, 2, 3, 5, 7, 9, -1], _.toArray(result))
    })
})

describe("toArray", () => {
    it("undefined", () => {
        const result = _.toArray(undefined)
        assert.deepEqual([], result)
    })
})

describe("every", () => {
    it("all", () => {
        const result = _.every([1, 2, 3], v => v > 0)
        assert.isTrue(result)
    })
    it("not all", () => {
        const result = _.every([1, 2, 0], v => v > 0)
        assert.isFalse(result)
    })
})

describe("reverse", () => {
    it("array", () => {
        const result = _.reverse([1, 2, 3])
        assert.deepEqual([3, 2, 1], result)
    })
})

describe("isEmpty", () => {
    it("empty", () => {
        const result = _.isEmpty(undefined)
        assert.isTrue(result)
    })
    it("not empty", () => {
        function *iterator() {
            yield 23
            // make sure we never check next item
            assert.fail()
        }
        const result = _.isEmpty(iterator())
        assert.isFalse(result)
    })
    it("with undefined", () => {
        const result = _.isEmpty([undefined])
        assert.isFalse(result)
    })
})

describe("findEntry", () => {
    it("some", () => {
        const result = _.findEntry([0, 1, 0], v => v === 0)
        assert.deepEqual(result, [0, 0])
    })
    it("none", () => {
        const result = _.find([0, 1, 0], v => v === 2)
        assert.deepEqual(result, undefined)
    })
    it("undefined", () => {
        const result = _.findEntry([undefined], () => true)
        assert.deepEqual(result, [0, undefined])
    })
})

describe("find", () => {
    it("some", () => {
        const result = _.find([0, 1, 0], v => v === 0)
        assert.deepEqual(result, 0)
    })
    it("none", () => {
        const result = _.find([0, 1, 0], v => v === 2)
        assert.deepEqual(result, undefined)
    })
    it("undefined", () => {
        const result = _.find([undefined], () => true)
        assert.deepEqual(result, undefined)
    })
})

describe("join", () => {
    it("/", () => {
        const result = _.join(["aaa", "bb", "c"], "/")
        assert.strictEqual(result, "aaa/bb/c")
    })
    it("one", () => {
        const result = _.join(["rrr"], "/")
        assert.strictEqual(result, "rrr")
    })
    it("empty", () => {
        const result = _.join([], "/")
        assert.strictEqual(result, "")
    })
})

describe("take", () => {
    it("1", () => {
        const result = _.toArray(_.take(["a", "b", "c"]))
        assert.deepStrictEqual(result, ["a"])
    })
})

describe("dropRight", () => {
    it("array", () => {
        const result = _.toArray(_.dropRight(["a", "b", "c", "d", "e"], 2))
        assert.deepStrictEqual(result, ["a", "b", "c"])
    })
    it("1", () => {
        const result = _.toArray(_.dropRight(["a", "b", "c", "d", "e"]))
        assert.deepStrictEqual(result, ["a", "b", "c", "d"])
    })
    it("undefined", () => {
        const result = _.dropRight(undefined)
        assert.deepStrictEqual(result, [])
    })
})