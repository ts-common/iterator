export type IteratorResult<T> = {
    readonly done: boolean;
    readonly value: T;
}

export type Iterator<T> = {
    readonly next: () => IteratorResult<T>;
}

export type Iterable<T> = {
    readonly [Symbol.iterator]: () => Iterator<T>;
}

export type IterableEx<T> = Iterable<T> & {
    readonly entries: () => IterableEx<Entry<T>>
    readonly map: <R>(func: (v: T, i: number) => R) => IterableEx<R>
    readonly flatMap: <R>(func: (v: T, i: number) => Iterable<R>) => IterableEx<R>
    readonly filter: (func: (v: T, i: number) => boolean) => IterableEx<T>
    readonly filterMap: <R>(func: (v: T, i: number) => R|undefined) => IterableEx<R>
    readonly forEach: (func: (v: T, i: number) => void) => void
    readonly drop: (n?: number) => IterableEx<T>
    readonly concat: (...input: readonly (Iterable<T>|undefined)[]) => IterableEx<T>
    readonly takeWhile: (func: (v: T, i: number) => boolean) => IterableEx<T>
    readonly take: (n?: number) => IterableEx<T>
    readonly findEntry: (func: (v: T, i: number) => boolean) => Entry<T>|undefined
    readonly find: (func: (v: T, i: number) => boolean) => T|undefined
    readonly fold: <A>(func: (a: A, b: T, i: number) => A, init: A) => A
    readonly reduce: (func: (a: T, b: T, i: number) => T) => T|undefined
    readonly last: () => T|undefined
    readonly some: (func?: (v: T, i: number) => boolean) => boolean
    readonly every: (func: (v: T, i: number) => boolean) => boolean
    readonly zip: (...inputs: readonly (Iterable<T>|undefined)[]) => IterableEx<readonly T[]>
    readonly isEqual: <B>(b: Iterable<B>|undefined, e?: (ai: T, bi: B) => boolean) => boolean
    readonly toArray: () => readonly T[]
    readonly reverse: () => readonly T[]
    readonly isEmpty: () => boolean
    readonly uniq: (key?: (v: T) => unknown) => IterableEx<T>,
}

export const iterable = <T>(createIterator: () => Iterator<T>): IterableEx<T> => {
    const property = <P extends readonly unknown[], R>(f: (self: Iterable<T>, ...p: P) => R) =>
        (...p: P) => f(result, ...p)
    const result: IterableEx<T> = {
        [Symbol.iterator]: createIterator,
        concat: property(concat),
        drop: property(drop),
        entries: property(entries),
        every: property(every),
        filter: property(filter),
        filterMap: property(filterMap),
        find: property(find),
        findEntry: property(findEntry),
        flatMap: property(flatMap),
        fold: property(fold),
        forEach: property(forEach),
        isEmpty: property(isEmpty),
        isEqual: property(isEqual),
        last: property(last),
        map: property(map),
        reduce: property(reduce),
        reverse: property(reverse),
        some: property(some),
        take: property(take),
        takeWhile: property(takeWhile),
        toArray: property(toArray),
        uniq: property(uniq),
        zip: property(zip),
    }
    return result
}

export type Entry<T> = readonly [number, T]

export const ENTRY_KEY = 0
export const ENTRY_VALUE = 1

export const chain = <T>(input: readonly T[]): IterableEx<T> => iterable(() => input[Symbol.iterator]())

export const entries = <T>(input: Iterable<T>|undefined): IterableEx<Entry<T>> =>
    iterable(function *() {
        // tslint:disable-next-line:no-if-statement
        if (input === undefined) {
            return
        }
        let index = 0
        /* tslint:disable-next-line:no-loop-statement */
        for (const value of input) {
            yield [index, value] as const
            /* tslint:disable-next-line:no-expression-statement */
            ++index
        }
    })

export const map = <T, I>(
    input: Iterable<I>|undefined,
    func: (v: I, i: number) => T,
): IterableEx<T> =>
    iterable(function *(): Iterator<T> {
        /* tslint:disable-next-line:no-loop-statement */
        for (const [index, value] of entries(input)) {
            yield func(value, index)
        }
    })

export const drop = <T>(input: Iterable<T>|undefined, n: number = 1): IterableEx<T> =>
    filter(input, (_, i) => n <= i)

export const flat = <T>(input: Iterable<Iterable<T>|undefined>|undefined): IterableEx<T> =>
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

export const concat = <T>(...input: readonly (Iterable<T>|undefined)[]): IterableEx<T> =>
    flat(input)

export const takeWhile = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): IterableEx<T> =>
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

export const findEntry = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): Entry<T>|undefined => {
    // tslint:disable-next-line:no-loop-statement
    for (const e of entries(input)) {
        // tslint:disable-next-line:no-if-statement
        if (func(e[ENTRY_VALUE], e[ENTRY_KEY])) {
            return e
        }
    }
    return undefined
}

export const find = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): T|undefined => {
    const e = findEntry(input, func)
    return e === undefined ? undefined : e[ENTRY_VALUE]
}

export const flatMap = <T, I>(
    input: Iterable<I>|undefined,
    func: (v: I, i: number) => Iterable<T>,
): IterableEx<T> =>
    flat(map(input, func))

export const optionalToArray = <T>(v: T|undefined): readonly T[] =>
    v === undefined ? [] : [v]

export const filterMap = <T, I>(
    input: Iterable<I>|undefined,
    func: (v: I, i: number) => T|undefined,
): IterableEx<T> =>
    flatMap(input, (v, i) => optionalToArray(func(v, i)))

export const filter = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean,
): IterableEx<T> =>
    flatMap(input, (v, i) => func(v, i) ? [v] : [])

const infinite = (): IterableEx<void> =>
    iterable(function *(): Iterator<void> {
        /* tslint:disable-next-line:no-loop-statement */
        while (true) { yield }
    })

export const generate = <T>(func: (i: number) => T, count?: number): IterableEx<T> =>
    infinite().takeWhile((_, i) => i !== count).map((_, i) => func(i))

export const repeat = <T>(v: T, count?: number): IterableEx<T> =>
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
        undefined,
    )

export const last = <T>(input: Iterable<T>|undefined): T|undefined =>
    reduce(input, (_, v) => v)

export const some = <T>(
    input: Iterable<T>|undefined,
    func: (v: T, i: number) => boolean = () => true,
): boolean =>
    findEntry(input, func) !== undefined

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

export const zip = <T>(...inputs: readonly (Iterable<T>|undefined)[]): IterableEx<readonly T[]> =>
    iterable(function *(): Iterator<readonly T[]> {
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

export const isArray = <T, U>(v: readonly T[]|U): v is readonly T[] =>
    v instanceof Array

export const toArray = <T>(i: Iterable<T>|undefined): readonly T[] =>
    i === undefined ? [] : Array.from(i)

export const reverse = <T>(i: Iterable<T>|undefined): readonly T[] =>
    fold(i, (a, b) => [b, ...a], new Array<T>())

export const isEmpty = <T>(i: Iterable<T>|undefined): boolean =>
    !some(i, () => true)

export const join = (i: Iterable<string>|undefined, separator: string): string => {
    const result = reduce(i, (a, b) => a + separator + b)
    return result === undefined ? "" : result
}

// tslint:disable-next-line:no-empty
export const empty = <T>() => iterable(function *(): Iterator<T> { })

export const dropRight = <T>(i: readonly T[]|undefined, n: number = 1): IterableEx<T> =>
    i === undefined ? empty() : take(i, i.length - n)

export const uniq = <T>(i: Iterable<T>, key: (v: T) => unknown = v => v): IterableEx<T> =>
    iterable(function *() {
        const set = new Set<unknown>()
        // tslint:disable-next-line:no-loop-statement
        for (const v of i) {
            const k = key(v)
            // tslint:disable-next-line:no-if-statement
            if (!set.has(k)) {
                // tslint:disable-next-line:no-expression-statement
                set.add(k)
                yield v
            }
        }
    })
