import { Tuple2, tuple2 } from "@ts-common/tuple"

export interface IteratorResult<T> {
    readonly done: boolean;
    readonly value: T;
}

export interface Iterator<T> {
    readonly next: () => IteratorResult<T>;
}

export interface Iterable<T> {
    readonly [Symbol.iterator]: () => Iterator<T>;
}

export const iterable = <T>(createIterator: () => Iterator<T>): Iterable<T> =>
    ({ [Symbol.iterator]: createIterator })

export type Entry<T> = Tuple2<number, T>

export const entry: <T>(key: number, value: T) => Entry<T> = tuple2

export const entries = <T>(input: Iterable<T>|undefined): Iterable<Entry<T>> =>
    iterable(function *(): Iterator<Entry<T>> {
        // tslint:disable-next-line:no-if-statement
        if (input === undefined) {
            return
        }
        let index = 0
        /* tslint:disable-next-line:no-loop-statement */
        for (const value of input) {
            yield entry(index, value)
            /* tslint:disable-next-line:no-expression-statement */
            ++index
        }
    })

export const map = <T, I>(
    input: Iterable<I>|undefined,
    func: (v: I, i: number) => T,
): Iterable<T> =>
    iterable(function *(): Iterator<T> {
        /* tslint:disable-next-line:no-loop-statement */
        for (const [index, value] of entries(input)) {
            yield func(value, index)
        }
    })

export const drop = <T>(input: Iterable<T>|undefined, n: number = 1): Iterable<T> =>
    filter(input, (_, i) => n <= i)

export const flatten = <T>(input: Iterable<Iterable<T>|undefined>|undefined): Iterable<T> =>
    iterable(function *(): Iterator<T> {
        // tslint:disable-next-line:no-if-statement
        if (input === undefined) {
            return
        }
        /* tslint:disable-next-line:no-loop-statement */
        for (const v of input) {
            // tslint:disable-next-line:no-if-statement
            if (v !== undefined) {
                yield *v
            }
        }
    })

// tslint:disable-next-line:readonly-array
export const concat = <T>(...input: Array<Iterable<T>|undefined>): Iterable<T> =>
    flatten(input)

export const takeWhile = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): Iterable<T> =>
    iterable(function *(): Iterator<T> {
        /* tslint:disable-next-line:no-loop-statement */
        for (const [index, value] of entries(input)) {
            /* tslint:disable-next-line:no-if-statement */
            if (!func(value, index)) {
                return
            }
            yield value
        }
    })

export const take = <T>(input: Iterable<T>|undefined, n: number = 1) =>
    takeWhile(input, (_, i) => i < n)

export const find = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): T|undefined => {
    // tslint:disable-next-line:no-loop-statement
    for (const [index, value] of entries(input)) {
        // tslint:disable-next-line:no-if-statement
        if (func(value, index)) {
            return value
        }
    }
    return undefined
}

export const flatMap = <T, I>(
    input: Iterable<I>|undefined,
    func: (v: I, i: number) => Iterable<T>,
): Iterable<T> =>
    flatten(map(input, func))

export const optionalToArray = <T>(v: T|undefined): ReadonlyArray<T> =>
    v === undefined ? [] : [v]

export const filterMap = <T, I>(
    input: Iterable<I>|undefined,
    func: (v: I, i: number) => T|undefined,
): Iterable<T> =>
    flatMap(input, (v, i) => optionalToArray(func(v, i)))

export const filter = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): Iterable<T> =>
    flatMap(input, (v, i) => func(v, i) ? [v] : [])

const infinite = (): Iterable<void> =>
    iterable(function *(): Iterator<void> {
        /* tslint:disable-next-line:no-loop-statement */
        while (true) { yield }
    })

export const generate = <T>(func: (i: number) => T, count?: number): Iterable<T> =>
    map(takeWhile(infinite(), (_, i) => i !== count), (_, i) => func(i))

export const repeat = <T>(v: T, count?: number): Iterable<T> =>
    generate(() => v, count)

export const fold = <T, A>(
    input: Iterable<T>|undefined,
    func: (a: A, b: T, i: number) => A,
    init: A,
): A => {
    let result: A = init
    /* tslint:disable-next-line:no-loop-statement */
    for (const [index, value] of entries(input)) {
        /* tslint:disable-next-line:no-expression-statement */
        result = func(result, value, index)
    }
    return result
}

export const reduce = <T>(
    input: Iterable<T>|undefined,
    func: (a: T, b: T, i: number) => T,
): T|undefined =>
    fold<T, T|undefined>(
        input,
        (a, b, i) => a !== undefined ? func(a, b, i) : b,
        undefined)

export const last = <T>(input: Iterable<T>|undefined): T|undefined =>
    reduce(input, (_, v) => v)

export const some = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): boolean =>
    find(input, func) !== undefined

export const every = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): boolean =>
    !some(input, (v, i) => !func(v, i))

export const forEach = <T>(input: Iterable<T>|undefined, func: (v: T, i: number) => void): void =>
    /* tslint:disable-next-line:no-expression-statement */
    fold<T, void>(input, (_, v, i) => { func(v, i) }, undefined)

export const sum = (input: Iterable<number>|undefined): number =>
    fold(input, (a, b) => a + b, 0)

export const min = (input: Iterable<number>|undefined): number =>
    fold(input, (a, b) => Math.min(a, b), Infinity)

export const max = (input: Iterable<number>|undefined): number =>
    fold(input, (a, b) => Math.max(a, b), -Infinity)

/* tslint:disable-next-line:readonly-array */
export const zip = <T>(...inputs: Array<Iterable<T>|undefined>): Iterable<ReadonlyArray<T>> =>
    iterable(function *(): Iterator<ReadonlyArray<T>> {
        const iterators = inputs.map(
            i => i === undefined ? [][Symbol.iterator]() : i[Symbol.iterator](),
        )
        /* tslint:disable-next-line:no-loop-statement */
        while (true) {
            const result = new Array<T>(inputs.length)
            /* tslint:disable-next-line:no-loop-statement */
            for (const [index, it] of entries(iterators)) {
                const v = it.next()
                /* tslint:disable-next-line:no-if-statement */
                if (v.done) {
                    return
                }
                /* tslint:disable-next-line:no-object-mutation no-expression-statement */
                result[index] = v.value
            }
            yield result
        }
    })

// TypeScript gives an error in case if type of a and type of b are different
export const isStrictEqual = (a: unknown, b: unknown) => a === b

export const isEqual = <A, B>(
    a: Iterable<A>|undefined,
    b: Iterable<B>|undefined,
    e: (ai: A, bi: B) => boolean = isStrictEqual,
): boolean => {
    // tslint:disable-next-line:no-if-statement
    if (isStrictEqual(a, b)) {
        return true
    }
    // tslint:disable-next-line:no-if-statement
    if (a === undefined || b === undefined) {
        return false
    }
    const ai = a[Symbol.iterator]()
    const bi = b[Symbol.iterator]()
    // tslint:disable-next-line:no-loop-statement
    while (true) {
        const av = ai.next()
        const bv = bi.next()
        // tslint:disable-next-line:no-if-statement
        if (av.done || bv.done) {
            return av.done === bv.done
        }
        // tslint:disable-next-line:no-if-statement
        if (!e(av.value, bv.value)) {
            return false
        }
    }
}

export const isArray = <T, U>(v: ReadonlyArray<T>|U): v is ReadonlyArray<T> =>
    v instanceof Array

export const toArray = <T>(i: Iterable<T>|undefined): ReadonlyArray<T> =>
    i === undefined ? [] : Array.from(i)

export const reverse = <T>(i: Iterable<T>|undefined): ReadonlyArray<T> =>
    fold(i, (a, b) => [b, ...a], new Array<T>())

export const isEmpty = <T>(i: Iterable<T>|undefined): boolean =>
    find(i, () => true) === undefined

export const join = (i: Iterable<string>|undefined, separator: string): string => {
    const result = reduce(i, (a, b) => a + separator + b)
    return result === undefined ? "" : result
}

export const dropRight = <T>(i: ReadonlyArray<T>|undefined, n: number = 1): Iterable<T> =>
    i === undefined ? [] : take(i, i.length - n)
