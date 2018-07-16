import { Tuple2, tuple2 } from "@ts-common/tuple"

export function iterable<T>(createIterator: () => Iterator<T>): Iterable<T> {
    return { [Symbol.iterator]: createIterator }
}

export type Entry<T> = Tuple2<number, T>

export const entry: <T>(key: number, value: T) => Entry<T> = tuple2

export function entries<T>(input: Iterable<T>): Iterable<Entry<T>> {
    function *iterator(): Iterator<Entry<T>> {
        let index = 0
        /* tslint:disable-next-line:no-loop-statement */
        for (const value of input) {
            yield entry(index, value)
            /* tslint:disable-next-line:no-expression-statement */
            ++index
        }
    }
    return iterable(iterator)
}

export function map<T, I>(input: Iterable<I>, func: (v: I, i: number) => T): Iterable<T> {
    function *iterator(): Iterator<T> {
        /* tslint:disable-next-line:no-loop-statement */
        for (const [index, value] of entries(input)) {
            yield func(value, index)
        }
    }
    return iterable(iterator)
}

export function flatten<T>(input: Iterable<Iterable<T>>): Iterable<T> {
    function *iterator(): Iterator<T> {
        /* tslint:disable-next-line:no-loop-statement */
        for (const v of input) {
            yield *v
        }
    }
    return iterable(iterator)
}

export function takeWhile<T>(input: Iterable<T>, func: (v: T, i: number) => boolean): Iterable<T> {
    function *iterator(): Iterator<T> {
        /* tslint:disable-next-line:no-loop-statement */
        for (const [index, value] of entries(input)) {
            /* tslint:disable-next-line:no-if-statement */
            if (!func(value, index)) {
                return
            }
            yield value
        }
    }
    return iterable(iterator)
}

export function flatMap<T, I>(
    input: Iterable<I>,
    func: (v: I, i: number) => Iterable<T>,
): Iterable<T> {
    return flatten(map(input, func))
}

export function optionalToArray<T>(v: T|undefined): ReadonlyArray<T> {
    return v === undefined ? [] : [v]
}

export function filterMap<T, I>(
    input: Iterable<I>,
    func: (v: I, i: number) => T|undefined,
): Iterable<T> {
    return flatMap(input, (v, i) => optionalToArray(func(v, i)))
}

export function filter<T>(input: Iterable<T>, func: (v: T, i: number) => boolean): Iterable<T> {
    return flatMap(input, (v, i) => func(v, i) ? [v] : [])
}

function infinite(): Iterable<void> {
    function *iterator(): Iterator<void> {
        /* tslint:disable-next-line:no-loop-statement */
        while (true) { yield }
    }
    return iterable(iterator)
}

export function generate<T>(func: (i: number) => T, count?: number): Iterable<T> {
    return map(takeWhile(infinite(), (_, i) => i !== count), (_, i) => func(i))
}

export function repeat<T>(v: T, count?: number): Iterable<T> {
    return generate(() => v, count)
}

export function fold<T, A>(input: Iterable<T>, func: (a: A, b: T, i: number) => A, init: A): A {
    let result: A = init
    /* tslint:disable-next-line:no-loop-statement */
    for (const [index, value] of entries(input)) {
        /* tslint:disable-next-line:no-expression-statement */
        result = func(result, value, index)
    }
    return result
}

export function reduce<T>(input: Iterable<T>, func: (a: T, b: T, i: number) => T): T|undefined {
    return fold<T, T|undefined>(
        input,
        (a, b, i) => a !== undefined ? func(a, b, i) : b,
        undefined)
}

export function last<T>(input: Iterable<T>): T|undefined {
    return reduce(input, (_, v) => v)
}

export function forEach<T>(input: Iterable<T>, func: (v: T, i: number) => void): void {
    /* tslint:disable-next-line:no-expression-statement */
    fold<T, void>(input, (_, v, i) => { func(v, i) }, undefined)
}

export function sum(input: Iterable<number>): number {
    return fold(input, (a, b) => a + b, 0)
}

export function min(input: Iterable<number>): number {
    return fold(input, (a, b) => Math.min(a, b), Infinity)
}

export function max(input: Iterable<number>): number {
    return fold(input, (a, b) => Math.max(a, b), -Infinity)
}

/* tslint:disable-next-line:readonly-array */
export function zip<T>(...inputs: Array<Iterable<T>>): Iterable<ReadonlyArray<T>> {
    function *iterator(): Iterator<ReadonlyArray<T>> {
        const iterators = inputs.map(i => i[Symbol.iterator]())
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
    }
    return iterable(iterator)
}

export function arrayEqual<T>(
    a: ReadonlyArray<T>|undefined,
    b: ReadonlyArray<T>|undefined,
    e: (ai: T, bi: T) => boolean,
): boolean {
    /* tslint:disable-next-line:no-if-statement */
    if (a === b) {
        return true
    }
    /* tslint:disable-next-line:no-if-statement */
    if (a === undefined || b === undefined) {
        return false
    }
    const al = a.length
    const bl = b.length
    /* tslint:disable-next-line:no-if-statement */
    if (al !== bl) {
        return false
    }
    /* tslint:disable-next-line:no-loop-statement */
    for (let i = 0; i < al; ++i) {
        /* tslint:disable-next-line:no-if-statement */
        if (!e(a[i], b[i])) {
            return false
        }
    }
    return true
}
