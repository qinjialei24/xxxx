import { Store } from 'redux';

type GetFirstArgFn<F> = F extends (a: infer A1, ...args: infer _U) => void
    ? (a: A1) => void
    : unknown;

type GetFirstArgOfObj<T> = {
    readonly [P in keyof T]: GetFirstArgFn<T[P]>;
};
export type HandleReducers<T> = {
    readonly //todo rename
    [P in keyof T]: GetFirstArgOfObj<T[P]>;
};
export type HandleActionMap<T> = {
    readonly //todo rename

    [P in keyof T]: {
        readonly [P2 in keyof T[P]]: string;
    };
};

export type RunParams<ReducerModules> = {
    readonly modules: any;
    readonly middlewares?: readonly any[];
};

export type RunResult<ReducerModules,Effects> = {
    readonly store: Store;
    readonly actions: HandleActionMap<ReducerModules>;
    readonly reducers: HandleReducers<ReducerModules>;
    readonly selectors: Record<string, unknown>;
    readonly effects: HandleReducers<Effects>;
};

export type MutableObject = Record<string, unknown>;

export type ModuleConfig = {
    namespace: string;
    state: unknown;
    reducer: Record<string, unknown>;
    effect: Record<string, unknown>;
};

export type Options<Namespace, State, Reducer,Effect> = {
    readonly namespace: Namespace;
    readonly state: State;
    readonly reducer: Reducer;
    readonly effect?: Effect;
};
