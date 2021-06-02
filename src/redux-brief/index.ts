import produce from 'immer';

let _store: any = {}
let _actionMap: any = {}

type GetFirstArgFn<F> = F extends (a: infer A1, ...args: infer U) => void ? (a: A1) => void : unknown;


type GetFirstArgOfObj<T> = {
    [P in keyof T]: GetFirstArgFn<T[P]>;
};

export type HandleReducerMap<T> = {
    [P in keyof T]: GetFirstArgOfObj<T[P]>;
};


export type HandleActionMap<T> = {
    [P in keyof T]: {
        [P2 in keyof T[P]]: string
    }
}


export interface ReducerModule {
    namespace: string
    state: Record<string, any>
    reducer: Record<string, (payload: any, state: any) => void>
}


const NAME_SPACE_FLAG = '/';
const REDUCER_KEY = 'reducer';

export const processReducerModules = <ReducerMap>(reducerModules: any) => {

    const obj = {} as any
    Object.keys(reducerModules).forEach(reducerName => {
        obj[reducerName] = createModel(reducerModules[reducerName])
    })
    const reducerMap = getReducerMap<ReducerMap>(obj);

    return {
        reduxBriefModules: obj,
        reducerMap,
        actionMap:_actionMap as HandleActionMap<ReducerMap>
    }
}

const getActionMap = (reducerModule: { [x: string]: any }, namespace: string) =>
    Object.keys(reducerModule).reduce((actionMap, actionName) => {
        const actionNameWithNamespace = namespace + NAME_SPACE_FLAG + actionName;
        generateActionMap(namespace, actionName, actionNameWithNamespace)
        return {
            ...actionMap,
            [actionName]: (payload: any) => {
                _store.dispatch({
                    type: actionNameWithNamespace,
                    payload,
                } as never);
            },
        };
    }, {});

const generateActionMap = (moduleName: string, actionName: string, actionNameWithNamespace: string) => {
    //todo 检查是否重复
    _actionMap[moduleName] = {
        ..._actionMap[moduleName],
        [actionName]: actionNameWithNamespace
    }
    console.log("-> _actionMap", _actionMap);

}

const getKey = (str: string) => str.substring(str.indexOf(NAME_SPACE_FLAG) + 1, str.length + 1);

// @ts-ignore
const withReducerModule = ({state, action, reducer, namespace = ''}) =>
    Object.keys(reducer)
        .map((key) => namespace + NAME_SPACE_FLAG + key)
        .includes(action.type)
        ? produce(state, (draft: any) => reducer[getKey(action.type)](action.payload, draft))
        : state;

export const createModel = (model: any) => {
    const {reducer, namespace} = model;
    const reducerModule = (state = model.state, action: any) => withReducerModule({state, action, reducer, namespace});
    // @ts-ignore
    reducerModule[REDUCER_KEY] = getActionMap(reducer, namespace);
    return reducerModule;
};

export const run = (
    store: { [x: string]: any },
    reducerModules: { [x: string]: { [x: string]: any } }
) => {
    _store = store
    Object.keys(reducerModules).forEach((moduleName) => {
        _store[moduleName] = reducerModules[moduleName][REDUCER_KEY];
    });
};

export const getReducerMap = <ReducerMap>(betterReduxModules: any): HandleReducerMap<ReducerMap> => {
    const obj = {} as any;
    Object.keys(betterReduxModules).forEach((moduleName) => {
        obj[moduleName] = betterReduxModules[moduleName][REDUCER_KEY];
    });
    return obj as HandleReducerMap<ReducerMap>;
};

// export const storeEnhancer = (createStore: (arg0: any, arg1: any, arg2: any) => any) => (
//     reducer: any,
//     preloadedState: any,
//     enhancer: any
// ) => {
//     const store = createStore(reducer, preloadedState, enhancer);
//     const oldDispatch = store.dispatch;
//     store.dispatch = (typeOrAction: any, payload: any) =>
//         typeof typeOrAction === 'object' ? oldDispatch(typeOrAction) : oldDispatch({type: typeOrAction, payload});
//     return store;
// };

