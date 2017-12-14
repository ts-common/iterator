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

export function generate<T>(func: (i: number) => T, count: number): Iterable<T> {
    function *iterator() {
        for (let i = 0; i < count; ++i) {
            yield func(i)
        }
    }
    return iterable(iterator)
}

export function repeat<T>(v: T, count: number): Iterable<T> {
    return generate(_ => v, count)
}

export function groupBy<T>(input: Iterable<[string, T]>, reduce: (a: T, b: T) => T)
    : ObjectAsMap<T>
{
    const result : { [key: string]: T } = {}
    for (const v of input) {
        const name = v[0]
        const value = v[1]
        const prior = result[name]
        result[name] = prior === undefined ? value : reduce(prior, value)
    }
    return result
}