export class GoodSet<T> {
    static add_called: number;
    private _keys: Set<string>;
    private _values: T[]

    constructor() {
        this._keys = new Set<string>();
        this._values = [];
        GoodSet.add_called = 0;
    }

    add = (...items: T[]): number => {
        let added_count = 0;
        for (const item of items) {
            const key = JSON.stringify(item)
            if (!this._keys.has(key)) {
                this._keys.add(key);
                this._values.push(item);
            }
        }
        return this._values.length;
    }

    has= (item: T): boolean => {
        return this._keys.has(JSON.stringify(item));
    }
    items = () => {
        return this._values;
    }

    static union<T>(...goodsets: GoodSet<T>[]): GoodSet<T> {
        const result = new GoodSet<T>();
        for (const set of goodsets) {
            result.add(...set.items());
        }
        return result;
    }
}