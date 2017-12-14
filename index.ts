export function iterable<T>(createIterator: () => Iterator<T>): Iterable<T> {
    class Implementation implements Iterable<T> {
        [Symbol.iterator]() {
            return createIterator()
        }
    }
    return new Implementation()
}

export interface ObjectAsMap<T> {
    readonly [key: string]: T;
}

export function map<T, I>(input: Iterable<I>, func: (v: I, i: number) => T): Iterable<T> {
    function *iterator() {
        let i = 0
        for (const v of input) {
            yield func(v, i)
            ++i
        }
    }
    return iterable(iterator)
}

export function flatten<T>(input: Iterable<Iterable<T>>): Iterable<T> {
    function *iterator() {
        for (const v of input) {
            yield *v
        }
    }
    return iterable(iterator)
}

export function flatMap<T, I>(input: Iterable<I>, func: (v: I, i: number) => Iterable<T>)
    : Iterable<T> {
    return flatten(map(input, func))
}

export function values<T>(input: ObjectAsMap<T>): Iterable<T> {
    return map(Object.getOwnPropertyNames(input), name => input[name])
}

export function entries<T>(input: ObjectAsMap<T>): Iterable<[string, T]> {
    return map(Object.getOwnPropertyNames(input), name => nameValue(name, input[name]))
}

export function nameValue<T>(name: string, value: T) : [string, T] {
    return [name, value]
}

export function getName<T>(nameValue: [string, T]): string {
    return nameValue[0]
}

export function getValue<T>(nameValue: [string, T]): T {
    return nameValue[1]
}

export function generate<T>(func: (i: number) => T, count?: number): Iterable<T> {
    const f: (i: number) => boolean = count === undefined ? () => true : i => i < count
    function *iterator() {
        for (let i = 0; f(i); ++i) {
            yield func(i)
        }
    }
    return iterable(iterator)
}

export function repeat<T>(v: T, count?: number): Iterable<T> {
    return generate(_ => v, count)
}

export function groupBy<T>(input: Iterable<[string, T]>, reduce: (a: T, b: T) => T)
    : ObjectAsMap<T>
{
    const result : { [key: string]: T } = {}
    for (const nv of input) {
        const n = getName(nv)
        const v = getValue(nv)
        const prior = result[n]
        result[n] = prior === undefined ? v : reduce(prior, v)
    }
    return result
}

export function reduce<T>(input: Iterable<T>, func: (a: T, b: T) => T, init: T): T
export function reduce<T>(input: Iterable<T>, func: (a: T, b: T) => T): T|undefined

export function reduce<T>(input: Iterable<T>, func: (a: T, b: T) => T, init?: T): T|undefined {
    for (const v of input) {
        init = init === undefined ? v : func(init, v)
    }
    return init
}

export function sum(input: Iterable<number>): number {
    return reduce(input, (a, b) => a + b, 0)
}

export function min(input: Iterable<number>): number {
    return reduce(input, Math.min, Infinity)
}

export function max(input: Iterable<number>): number {
    return reduce(input, Math.max, -Infinity)
}

export function zip<T>(...inputs: Iterable<T>[]): Iterable<T[]> {
    function *iterator() {
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

export function toObject<T>(input: Iterable<[string, T]>): ObjectAsMap<T> {
    const result: { [name: string]: T } = {}
    for (const nv of input) {
        result[getName(nv)] = getValue(nv)
    }
    return result
}