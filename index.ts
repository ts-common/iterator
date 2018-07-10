export function iterable<T>(createIterator: () => Iterator<T>): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> { return createIterator() },
    }
}

export function flatMap<T, I>(
    input: Iterable<I>,
    func: (v: I, i: number) => Iterable<T>|undefined,
): Iterable<T> {
    function *iterator(): Iterator<T> {
        let i = 0
        for (const v of input) {
            const result = func(v, i)
            if (result === undefined) {
                return
            }
            yield *result
            ++i
        }
    }
    return iterable(iterator)
}

export function map<T, I>(input: Iterable<I>, func: (v: I, i: number) => T): Iterable<T> {
    return flatMap(input, (v, i) => [func(v, i)])
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

export function flatten<T>(input: Iterable<Iterable<T>>): Iterable<T> {
    return flatMap(input, v => v)
}

function infinite(): Iterable<void> {
    function *iterator(): Iterator<void> {
        while (true) { yield }
    }
    return iterable(iterator)
}

export function generate<T>(func: (i: number) => T, count?: number): Iterable<T> {
    return flatMap(infinite(), (_, i) => i === count ? undefined : [func(i)])
}

export function repeat<T>(v: T, count?: number): Iterable<T> {
    return generate(() => v, count)
}

export function forEach<T>(input: Iterable<T>, func: (v: T, i: number) => void): void {
    let i = 0
    for (const v of input) {
        func(v, i)
        ++i
    }
}

export function reduce<T>(input: Iterable<T>, func: (a: T, b: T, i: number) => T, init: T): T
export function reduce<T>(input: Iterable<T>, func: (a: T, b: T, i: number) => T): T|undefined

export function reduce<T>(
    input: Iterable<T>,
    func: (a: T, b: T, i: number) => T,
    init?: T,
): T|undefined {
    forEach(input, (v, i) => init = init === undefined ? v : func(init, v, i))
    return init
}

export function sum(input: Iterable<number>): number {
    return reduce(input, (a, b) => a + b, 0)
}

export function min(input: Iterable<number>): number {
    return reduce(input, (a, b) => Math.min(a, b), Infinity)
}

export function max(input: Iterable<number>): number {
    return reduce(input, (a, b) => Math.max(a, b), -Infinity)
}

/* tslint:disable-next-line:readonly-array */
export function zip<T>(...inputs: Array<Iterable<T>>): Iterable<ReadonlyArray<T>> {
    function *iterator(): Iterator<ReadonlyArray<T>> {
        const iterators = inputs.map(i => i[Symbol.iterator]())
        while (true) {
            const result = new Array<T>(inputs.length)
            let i = 0;
            for (const it of iterators) {
                const v = it.next()
                if (v.done) {
                    return
                }
                result[i] = v.value
                ++i
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

    if (a === b) {
        return true
    }
    if (a === undefined || b === undefined) {
        return false
    }
    const al = a.length
    const bl = b.length
    if (al !== bl) {
        return false
    }
    for (let i = 0; i < al; ++i) {
        if (!e(a[i], b[i])) {
            return false
        }
    }
    return true
}
