import * as _ from "../index"
import "mocha";
import * as chai from "chai"

chai.should()

describe("map", () => {
    it("array", () => {
        const result = Array.from(_.map([1, 2, 3], x => x * x))
        result.should.deep.equal([1, 4, 9])
    })
})

describe("flatten", () => {
    it("array", () => {
        const result = Array.from(_.flatten([[1, 2], [2, 3], [3, 4]]))
        result.should.deep.equal([1, 2, 2, 3, 3, 4])
    })
})

describe("flatMap", () => {
    it("array", () => {
        const result = Array.from(_.flatMap([1, 2, 3], x => [x, x * 2]))
        result.should.deep.equal([1, 2, 2, 4, 3, 6])
    })
})

describe("groupBy", () => {
    it("array", () => {
        const m = _.map([1, 2, 3, 1, 3, 2, 3, 3], x => _.nameValue(x.toString(), 1))
        const result = _.groupBy(m, (a, b) => a + b)
        result.should.deep.equal({ 1: 2, 2: 2, 3: 4 })
    })
})

describe("values", () => {
    it("array", () => {
        const result = Array.from(_.values({ 1: 2, 2: 2, 3: 3 }))
        result.should.deep.equal([2, 2, 3])
    })
})

describe("entries", () => {
    it("array", () => {
        const result = Array.from(_.entries({ 1: 2, 2: 2, 3: 3 }))
        result.should.deep.equal([["1", 2], ["2", 2], ["3", 3]])
    })
})

describe("repeat", () => {
    it("array", () => {
        const result = Array.from(_.repeat("Hello!", 5))
        result.should.deep.equal(["Hello!", "Hello!", "Hello!", "Hello!", "Hello!"])
    })
})

describe("zip", () => {
    it("array", () => {
        const result = Array.from(_.zip([1, "b"], ["a", 2]))
        result.should.deep.equal([[1, "a"], ["b", 2]])
    })
})

describe("generate", () => {
    it("infinite", () => {
        const result = Array.from(_.zip(_.repeat(2), [1, 3]))
        result.should.deep.equal([[2, 1], [2, 3]])
    })
})

describe("reduce", () => {
    it("no items", () => {
        const result = _.reduce([], a => a)
        chai.assert.isUndefined(result)
    })
    it("1", () => {
        const result = _.reduce([1], (a, b) => a + b)
        if (result === undefined) {
            throw new Error("undefined")
        }
        result.should.equal(1)
    })
})

describe("sum", () => {
    it("array", () => {
        const result = _.sum([1, 2, 3])
        result.should.equal(6)
    })
})

describe("min", () => {
    it("3", () => {
        const result = _.min([1, 2, 3])
        result.should.equal(1)
    })
    it("0", () => {
        const result = _.min([])
        result.should.equal(Infinity)
    })
})

describe("max", () => {
    it("3", () => {
        const result = _.max([1, 2, 3])
        result.should.equal(3)
    })
    it("0", () => {
        const result = _.max([])
        result.should.equal(-Infinity)
    })
})

describe("toObject", () => {
    it("toObject", () => {
        const result = _.toObject([["a", 2], ["b", 4]])
        result.should.deep.equal({ a: 2, b: 4 })
    })
})
