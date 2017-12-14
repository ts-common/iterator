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
        const result = Array.from(_.flatten([[1, 2], [2, 3], [3,4]]))
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
        const result = _.groupBy(m, (a, b) => a + b, )
        result.should.deep.equal({ "1": 2, "2": 2, "3": 4 })
    })
})

describe("values", () => {
    it("array", () => {
        const result = Array.from(_.values({ "1": 2, "2": 2, "3": 3 }))
        result.should.deep.equal([2, 2, 3])
    })
})

describe("entries", () => {
    it("array", () => {
        const result = Array.from(_.entries({ "1": 2, "2": 2, "3": 3 }))
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
