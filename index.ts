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
        /* tslint:disable-next-line:no-loop-statement */
        for (const v of input) {
            const result = func(v, i)
            /* tslint:disable-next-line:no-if-statement */
            if (result === undefined) {
                return
            }
            yield *result
            /* tslint:disable-next-line:no-expression-statement */
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
        /* tslint:disable-next-line:no-loop-statement */
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

export function fold<T, A>(input: Iterable<T>, func: (a: A, b: T, i: number) => A, init: A): A {
     let result = init
     let i = 0
     /* tslint:disable-next-line:no-loop-statement */
     for (const v of input) {
         /* tslint:disable-next-line:no-expression-statement */
         result = func(result, v, i)
         /* tslint:disable-next-line:no-expression-statement */
         ++i
     }
     return result
}

export function reduce<T>(input: Iterable<T>, func: (a: T, b: T, i: number) => T): T|undefined {
    return fold<T, T|undefined>(
        input,
        (a, b, i) => a !== undefined ? func(a, b, i) : b,
        undefined)
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
            let i = 0;
            /* tslint:disable-next-line:no-loop-statement */
            for (const it of iterators) {
                const v = it.next()
                /* tslint:disable-next-line:no-if-statement */
                if (v.done) {
                    return
                }
                /* tslint:disable-next-line:no-object-mutation no-expression-statement */
                result[i] = v.value
                /* tslint:disable-next-line:no-expression-statement */
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
