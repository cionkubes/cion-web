import { map, curry, _, pipe, compose, reduce, foldl, foldr, filter, take, first } from '../../development/scripts/helpers/fp';

describe("map", () => {
    it("should handle falsy values", () => {
        expect(Array.from(map(b => !b, [true, false]))).toEqual([false, true]);
    });

    it("should handle undefined values", () => {
        expect(Array.from(map(b => b, [undefined, 'b']))).toEqual([undefined, 'b']);
    });

    it("should be curried", () => {
        expect(Array.from(map(b => !b)([true, false]))).toEqual([false, true]);
    });

    it("should never call mapping function on an empty list", () => {
        let t = true;

        Array.from(map(it => t = false, []));

        expect(t).toEqual(true);
    });
});

describe("curry", () => {
    it("should handle split args", () => {
        const fn = (a, b) => a + b;
        const curried = curry(fn);

        expect(curried(123)()(4523)).toEqual(fn(123, 4523));
    });

    it("should handle collected args", () => {
        const fn = (a, b) => a + b;
        const curried = curry(fn);

        expect(curried(123, 4523)).toEqual(fn(123, 4523));
    });

    it("should handle repeat calls", () => {
        const fn = (a, b) => a + b;
        let curried = curry(fn);
        let curried2 = curried(123);

        expect(curried(123, 4523)).toEqual(fn(123, 4523));
        expect(curried(123, 4523)).toEqual(fn(123, 4523));
        expect(curried2(4523)).toEqual(fn(123, 4523));
    });

    it("should order placeholder args", () => {
        const fn = (a, b) => a + b;
        const curried = curry(fn);

        expect(curried(_, 'b')('a')).toEqual(fn('a', 'b'));
    });

    it("should handle all permutations of placeholder args", () => {
        const fn = (a, b, c) => a + b + c;
        const curried = curry(fn);

        expect(curried(_, _, _)('a', 'b', 'c')).toEqual(fn('a', 'b', 'c'));
        expect(curried(_, _, 'c')('a', 'b')).toEqual(fn('a', 'b', 'c'));
        expect(curried(_, 'b', _)('a', 'c')).toEqual(fn('a', 'b', 'c'));
        expect(curried('a', _, _)('b', 'c')).toEqual(fn('a', 'b', 'c'));
        expect(curried(_, 'b', 'c')('a')).toEqual(fn('a', 'b', 'c'));
        expect(curried('a', _, 'c')('b')).toEqual(fn('a', 'b', 'c'));
        expect(curried('a', 'b', _)('c')).toEqual(fn('a', 'b', 'c'));
        expect(curried('a', 'b', 'c')).toEqual(fn('a', 'b', 'c'));
    });
});

describe("pipe", () => {
    it("should thread item through functions", () => {
        const result = pipe([3, 6],
            map(n => n + 2),
            map(n => n * 2),
            Array.from
        );

        expect(result).toEqual([10, 16]);
    });
});

describe("compose", () => {
    it("should join functions", () => {
        const addTwoMultilpyTwo = compose(
            map(n => n + 2),
            map(n => n * 2),
            Array.from
        );

        expect(addTwoMultilpyTwo([4, 5])).toEqual([12, 14]);
    });
});

describe("reduce", () => {
    it("should be foldl", () => {
        expect(reduce).toBe(foldl);
    });
});

describe("foldl", () => {
    it("should reduce iterable to value", () => {
        expect(foldl(2, (a, b) => a / b, [1, 2])).toEqual(1);
    });

    it("should accept no parameter for start value", () => {
        expect(foldl((a, b) => a / b, [1, 2])).toEqual(1 / 2);
    });

    it("should be curryable", () => {
        expect(foldl(2, (a, b) => a / b)([1, 2])).toEqual(1);
        expect(foldl((a, b) => a / b)([1, 2])).toEqual(1 / 2);
    });
});

describe("foldr", () => {
    it("should reduce iterable to value", () => {
        expect(foldr(2, (a, b) => a / b, [1, 2])).toEqual(1);
    });

    it("should accept no parameter for start value", () => {
        expect(foldr((a, b) => a / b, [1, 2])).toEqual(2);
    });

    it("should be curryable", () => {
        expect(foldr(2, (a, b) => a / b)([1, 2])).toEqual(1);
        expect(foldr((a, b) => a / b)([1, 2])).toEqual(2);
    });
});

describe("filter", () => {
    it("should filter out items not passing the predicate", () => {
        expect(Array.from(filter(item => item === 2, [2, 1, 2]))).toEqual([2, 2]);
    });

    it("should support currying", () => {
        expect(Array.from(filter(item => item === 2)([2, 1, 2]))).toEqual([2, 2]);
    });
});

describe("take", () => {
    it("should only take first n items", () => {
        expect(Array.from(take(2, [2, 1, 2]))).toEqual([2, 1]);
    });

    it("should support currying", () => {
        expect(Array.from(take(2)([2, 1, 2]))).toEqual([2, 1]);
    });
});

describe("first", () => {
    it("should select first item", () => {
        expect(first([2, 1, 2])).toEqual(2);
    });
});