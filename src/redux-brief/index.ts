import produce from 'immer';

let _store:any={}

type GetFirstArgFn<F> = F extends (a: infer A1, ...args: infer U) => void ? (a: A1) => void : unknown;

type GetFirstArgOfObj<T> = {
    [P in keyof T]: GetFirstArgFn<T[P]>;
};

export type HandleReducerMap<T> = {
    [P in keyof T]: GetFirstArgOfObj<T[P]>;
};


const NAME_SPACE_FLAG = '/';
const ACTION_NAME = 'action';

export const processReducerModules = <ReducerMap>(reducerModules: any) => {

    const obj = {} as any
    Object.keys(reducerModules).forEach(reducerName => {
        obj[reducerName] = createModel(reducerModules[reducerName])
    })
    const reducerMap = getReducerMap<ReducerMap>(obj);

    return {
        reduxBriefModules: obj,
        reducerMap
    }
}

const getActionMap = (reducerModule: { [x: string]: any }, namespace: string) =>
    Object.keys(reducerModule).reduce((actionMap, actionName) => {
        const actionType = namespace + NAME_SPACE_FLAG + actionName;
        return {
            ...actionMap,
            [actionName]: (payload: any) => {
                _store.dispatch({
                    type: actionType,
                    payload,
                } as never);
            },
        };
    }, {});

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
    reducerModule[ACTION_NAME] = getActionMap(reducer, namespace);
    return reducerModule;
};

export const run = (
    store: { [x: string]: any },
    reducerModules: { [x: string]: { [x: string]: any } }
) => {
    _store =store
    Object.keys(reducerModules).forEach((moduleName) => {
        _store[moduleName] = reducerModules[moduleName][ACTION_NAME];
    });
};

export const getReducerMap = <ReducerMap>(betterReduxModules: any): HandleReducerMap<ReducerMap> => {
    const obj = {} as any;
    Object.keys(betterReduxModules).forEach((moduleName) => {
        obj[moduleName] = betterReduxModules[moduleName][ACTION_NAME];
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

