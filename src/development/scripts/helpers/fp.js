export const _ = Symbol('placeholder');

export function compose(...fns) {
    return item => {
        for (let fn of fns) {
            item = fn(item);
        }

        return item;
    }
}

export function pipe(item, ...fns) {
    return compose(...fns)(item);
}

export const take = curry((n, iterable) => {
    let item;
    let i = 0;
    const iterator = iterable[Symbol.iterator]();

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            if (i >= n) {
                return { done: true };
            }

            i++;
            return iterator.next();
        },
    };
});

export function first(iterable) {
    return iterable[Symbol.iterator]().next().value;
};

export const each = curry((fn, iterable) => {
    for (let item of iterable) {
        fn(item);
    }
});

export const map = curry((fn, iterable) => {
    let item;
    const iterator = iterable[Symbol.iterator]();

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            item = iterator.next();
            item.value = fn(item.value);

            return item;
        },
    };
});

export const filter = curry((predecate, iterable) => {
    let item;
    const iterator = iterable[Symbol.iterator]();

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            item = iterator.next();

            while (!(item.done || predecate(item.value))) {
                item = iterator.next();
            }

            return item;
        },
    };
});

export function isfunction(obj) {
    return Object.prototype.toString.call(obj) == '[object Function]';
}

function _fold_args_pred_type_1(args) {
    return isfunction(args[0]) && args.length == 2;
}

function _fold_combinator(fold_fn) {
    return curry(fold_fn, args => _fold_args_pred_type_1(args) || args.length == 3, args => {
        if (_fold_args_pred_type_1(args)) {
            return fold_fn(undefined, ...args);
        } else {
            return fold_fn(...args);
        }
    })
}

const _foldl = (start, fn, iterable) => {
    const iterator = iterable[Symbol.iterator]();
    let collector = typeof start !== "undefined" ? start : iterator.next().value;

    for (let elem of iterator) {
        collector = fn(collector, elem);
    }

    return collector;
}

const _foldr = (start, fn, iterable) => {
    return _foldl(start, fn, Array.from(iterable).reverse());
}

export const foldr = _fold_combinator(_foldr);
export const foldl = _fold_combinator(_foldl);
export const reduce = foldl;

function curry_factory(fn, state, predecate, on_completion) {
    return (...innerArgs) => {
        const newState = {
            args: state.args.concat([]),
            placeholders: state.placeholders.concat([]),
        };

        let pIndex;
        const tmpPlaceholders = [];

        for (let arg of innerArgs) {
            if (arg === _) {
                tmpPlaceholders.push(newState.args.length + tmpPlaceholders.length + newState.placeholders.length);
                continue;
            }

            if (newState.placeholders.length <= 0) {
                newState.args.push(arg);
            } else {
                pIndex = newState.placeholders.shift();
                newState.args.splice(pIndex, 0, arg);
            }
        }

        for (let placeholder of tmpPlaceholders) {
            newState.placeholders.push(placeholder);
        }

        if (predecate(newState.args)) {
            return on_completion(newState.args)
        } else if (newState.args.length < fn.length) {
            return curry_factory(fn, newState, predecate, on_completion);
        } else {
            throw 'Too many args passed to curried function';
        }
    }
}

export function curry(fn, predecate, on_completion) {
    predecate = (typeof predecate !== 'undefined') ? predecate : args => args.length == fn.length;
    on_completion = (typeof on_completion !== 'undefined') ? on_completion : args => fn(...args);

    return curry_factory(fn, {
        args: [],
        placeholders: [],
    }, predecate, on_completion);
}