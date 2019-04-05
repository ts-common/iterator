/* tslint:disable */

import * as _ from "../index"
import "mocha";
import * as assert from "assert"

describe("map", () => {
    it("array", () => {
        const result = _.map([1, 2, 3], x => x * x).toArray()
        assert.deepEqual([1, 4, 9], result)
    })
    it("undefined", () => {
        const result = _.map(undefined, x => x).toArray()
        assert.deepEqual([], result)
    })
    it("member", () => {
        const result = Array.from(_.chain([1, 2, 3]).map(x => x * x))
        assert.deepEqual([1, 4, 9], result)
    })
})

describe("filter", () => {
    it("array", () => {
        const result = Array.from(_.filter([1, 2, 3, 4], x => x % 2 === 0))
        assert.deepEqual([2, 4], result)
    })
    it("member", () => {
        const result = Array.from(_.iterable(function *() { yield *[1, 2, 3, 4] }).filter(x => x % 2 === 0))
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
    it("member", () => {
        const result = Array.from(_.iterable(function *() { yield *["a", "b", "c", "d", "e"] }).drop(2))
        assert.deepEqual(["c", "d", "e"], result)
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
    it("member", () => {
        const result = Array.from(_.concat([1, 2, 3, 4]).filterMap(x => x < 3 ? x * 2 : undefined))
        assert.deepEqual([2, 4], result)
    })
})

describe("flat", () => {
    it("array", () => {
        const result = Array.from(_.flat([[1, 2], [2, 3], [3, 4]]))
        assert.deepEqual([1, 2, 2, 3, 3, 4], result)
    })
    it("undefined", () => {
        const result = Array.from(_.flat(undefined))
        assert.deepEqual([], result)
    })
})

describe("flatMap", () => {
    it("array", () => {
        const result = Array.from(_.flatMap([1, 2, 3], x => [x, x * 2]))
        assert.deepEqual([1, 2, 2, 4, 3, 6], result)
    })
    it("member", () => {
        const result = Array.from(_.iterable(() => [1, 2, 3][Symbol.iterator]()).flatMap(x => [x, x * 2]))
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
    it("member", () => {
        const result = Array.from(_.concat([1, "b", 4]).zip(["a", 2, 6]))
        assert.deepEqual([[1, "a"], ["b", 2], [4, 6]], result)
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
        assert.strictEqual(result, undefined)
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
    it("member", () => {
        const result = _.concat([1, 2, 3]).reduce((a, b) => a + b)
        if (result === undefined) {
            throw new Error("undefined")
        }
        assert.equal(6, result)
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

describe("fold", () => {
    it("member", () => {
        const result = _.concat([1, 2, 3]).fold((a, b) => a + b, "")
        assert.equal(result, "123")
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
    it("member", () => {
        let x = 0
        let ii = 0
        _.concat([1, 2, 4]).forEach(
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
        assert.strictEqual(result, true)
    })
    it("equal", () => {
        const result = _.isEqual(["a", "b"], ["a", "b"], (a, b) => a === b)
        assert.strictEqual(result, true)
    })
    it("length", () => {
        const result = _.isEqual(["a", "b"], ["a", "b", "c"], (a, b) => a === b)
        assert.strictEqual(result, false)
    })
    it("not equal", () => {
        const result = _.isEqual(["a", "b"], ["a", "c"], (a, b) => a === b)
        assert.strictEqual(result, false)
    })
    it("default e", () => {
        const result = _.isEqual(["a", "b"], ["a", "c"])
        assert.strictEqual(result, false)
    })
    it("one undefined", () => {
        const result = _.isEqual(undefined, "a")
        assert.strictEqual(result, false)
    })
    it("both undefined", () => {
        const result = _.isEqual(undefined, undefined)
        assert.strictEqual(result, true)
    })
    it("member", () => {
        const result = _.concat(["a", "b"]).isEqual(["a", "c"])
        assert.strictEqual(result, false)
    })
})

describe("last", () => {
    it("3", () => {
        const result = _.last([1, 4, 5, 3])
        assert.equal(3, result)
    })
    it("undefined", () => {
        const result = _.last([])
        assert.strictEqual(result, undefined)
    })
    it("member", () => {
        const result = _.concat([1, 4, 5, 3, 9]).last()
        assert.equal(9, result)
    })
})

describe("some", () => {
    it("some", () => {
        const result = _.some([1, 2, 3, 4], v => v == 2)
        assert.strictEqual(result, true)
    })
    it("none", () => {
        const result = _.some([1, 5, 3, 4], v => v == 2)
        assert.strictEqual(result, false)
    })
    it("with undefined", () => {
        const result = _.some([undefined], () => true)
        assert.strictEqual(result, true)
    })
    it("member", () => {
        const result = _.concat([1, 2, 3, 4]).some(v => v == 4)
        assert.strictEqual(result, true)
    })
    it("member default, non empty", () => {
        const result = _.concat([1, 2]).some()
        assert.strictEqual(result, true)
    })
    it("member default, empty", () => {
        const result = _.concat([]).some()
        assert.strictEqual(result, false)
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
    it("member", () => {
        const result = _.concat([91, 140]).concat([1, 2, 3], [5, 7, 9], undefined, [-1])
        assert.deepEqual([91, 140, 1, 2, 3, 5, 7, 9, -1], _.toArray(result))
    })
})

describe("toArray", () => {
    it("undefined", () => {
        const result = _.toArray(undefined)
        assert.deepEqual([], result)
    })
    it("member", () => {
        const result = _.concat([1, 2, 3]).toArray()
        assert.deepEqual([1, 2, 3], result)
    })
})

describe("every", () => {
    it("all", () => {
        const result = _.every([1, 2, 3], v => v > 0)
        assert.strictEqual(result, true)
    })
    it("not all", () => {
        const result = _.every([1, 2, 0], v => v > 0)
        assert.strictEqual(result, false)
    })
    it("member", () => {
        const result = _.concat([1, 2, 3]).every(v => v > 0)
        assert.strictEqual(result, true)
    })
})

describe("reverse", () => {
    it("array", () => {
        const result = _.reverse([1, 2, 3])
        assert.deepEqual([3, 2, 1], result)
    })
    it("member", () => {
        const result = _.concat([1, 2, 3]).reverse()
        assert.deepEqual([3, 2, 1], result)
    })
})

describe("isEmpty", () => {
    it("empty", () => {
        const result = _.isEmpty(undefined)
        assert.strictEqual(result, true)
    })
    it("not empty", () => {
        function *iterator() {
            yield 23
            // make sure we never check next item
            assert.fail()
        }
        const result = _.isEmpty(iterator())
        assert.strictEqual(result, false)
    })
    it("with undefined", () => {
        const result = _.isEmpty([undefined])
        assert.strictEqual(result, false)
    })
    it("member", () => {
        const result = _.concat([2]).isEmpty()
        assert.strictEqual(result, false)
    })
})

describe("entries", () => {
    it("member", () => {
        const result = _.toArray(_.iterable(function *(): _.Iterator<string> { yield "a"; yield "b"; yield "c"; }).entries())
        assert.deepEqual(result, [[0, "a"], [1, "b"], [2, "c"]])
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
    it("member", () => {
        const result = _.concat([0, 1, 0]).findEntry(v => v === 0)
        assert.deepEqual(result, [0, 0])
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
    it("member", () => {
        const result = _.concat([0, 1, 0]).find(v => v === 2)
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

describe("takeWhile", () => {
    it("member", () => {
        const result = _.toArray(_.concat(["a", "b", "c", "d"]).takeWhile(v => v !== "c"))
        assert.deepStrictEqual(result, ["a", "b"])
    })
})

describe("take", () => {
    it("1", () => {
        const result = _.toArray(_.take(["a", "b", "c"]))
        assert.deepStrictEqual(result, ["a"])
    })
    it("member", () => {
        const result = _.toArray(_.concat(["a", "b", "c", "d"]).take(2))
        assert.deepStrictEqual(result, ["a", "b"])
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
        const result = _.dropRight(undefined).toArray()
        assert.deepStrictEqual(result, [])
    })
})

describe("uniq", () => {
    it("sorted", () => {
        const result = _.toArray(_.uniq([1, 2, 2, 3]))
        assert.deepStrictEqual(result, [1, 2, 3])
    })
    it("unsorted", () => {
        const result = _.toArray(_.uniq([3, 1, 2, 2, 3]))
        assert.deepStrictEqual(result, [3, 1, 2])
    })
    it("complex", () => {
        const result = _.toArray(_.uniq(
            [{ a: 3 },  { a: 1 },  { a: 2 }, { a: 2 }, { a: 3 }],
            v => v.a
        ))
        assert.deepStrictEqual(result, [{ a: 3 }, { a: 1 }, { a: 2 }])
    })
    it("member", () => {
        const result = _.concat([3, 1, 2, 2, 3]).uniq().toArray()
        assert.deepStrictEqual(result, [3, 1, 2])
    })
})