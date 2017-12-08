export function map<T, I>(input: Iterable<I>, func: (v: I) => T): Iterable<T> {
    function *iterator() {
        for (const v of input) {
            yield func(v)
        }
    }
    return { [Symbol.iterator]: iterator }
}

export function flatten<T>(input: Iterable<Iterable<T>>): Iterable<T> {
    function *iterator() {
        for (const v of input) {
            yield *v
        }
    }
    return { [Symbol.iterator]: iterator }
}

export function flatMap<T, I>(input: Iterable<I>, func: (v: I) => Iterable<T>): Iterable<T> {
    return flatten(map(input, func))
}

export interface ObjectAsMap<T> {
    readonly [key: string]: T;
}

export function values<T>(input: ObjectAsMap<T>): Iterable<T> {
    return map(Object.getOwnPropertyNames(input), k => input[k])
}

export function groupBy<T>(input: Iterable<T>, getKey: (v: T) => string, reduce: (a: T, b: T) => T)
    : ObjectAsMap<T>
{
    const result : { [key: string]: T } = {}
    for (const v of input) {
        const key = getKey(v)
        const prior = result[key]
        result[key] = prior === undefined ? v : reduce(prior, v)
    }
    return result
}