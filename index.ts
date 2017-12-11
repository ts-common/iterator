export interface ExtendedIterable<T> extends Iterable<T> {
    map<R>(func: (v: T) => R): ExtendedIterable<R>
    flatMap<R>(func: (v: T) => Iterable<R>): ExtendedIterable<R>
    groupBy<R>(nameValue: (v: T) => [string, R], reduce: (a: R, b: R) => R): ObjectAsMap<R>
    toArray(): T[]
}

export function iterable<T>(createIterator: () => Iterator<T>): ExtendedIterable<T> {
    class Implementation implements ExtendedIterable<T> {
        toArray(): T[] {
            return Array.from(this);
        }
        [Symbol.iterator]() {
            return createIterator()
        }
        map<R>(func: (v: T) => R) {
            return map(this, func)
        }
        flatMap<R>(func: (v: T) => Iterable<R>) {
            return flatMap(this, func)
        }
        groupBy<R>(nameValue: (v: T) => [string, R], reduce: (a: R, b: R) => R): ObjectAsMap<R> {
            return groupBy(this.map(nameValue), reduce)
        }
    }
    return new Implementation()
}

export interface ObjectAsMap<T> {
    readonly [key: string]: T;
}

export function map<T, I>(input: Iterable<I>, func: (v: I) => T): ExtendedIterable<T> {
    function *iterator() {
        for (const v of input) {
            yield func(v)
        }
    }
    return iterable(iterator)
}

export function flatten<T>(input: Iterable<Iterable<T>>): ExtendedIterable<T> {
    function *iterator() {
        for (const v of input) {
            yield *v
        }
    }
    return iterable(iterator)
}

export function flatMap<T, I>(input: Iterable<I>, func: (v: I) => Iterable<T>)
    : ExtendedIterable<T>
{
    return flatten(map(input, func))
}

export function values<T>(input: ObjectAsMap<T>): ExtendedIterable<T> {
    return map(Object.getOwnPropertyNames(input), name => input[name])
}

export function entries<T>(input: ObjectAsMap<T>): ExtendedIterable<[string, T]> {
    return map(Object.getOwnPropertyNames(input), name => nameValue(name, input[name]))
}

export function nameValue<T>(name: string, value: T) : [string, T] {
    return [name, value]
}

export function repeat<T>(v: T, count: number): ExtendedIterable<T> {
    function *iterator() {
        for (let i = 0; i < count; ++i) {
            yield v
        }
    }
    return iterable(iterator)
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