import produce from 'immer';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
    HandleActionMap,
    HandleReducers,
    MutableObject,
    Options,
    ModuleConfig,
    RunParams,
    RunResult,
} from './types';

export const NAME_SPACE_FLAG = '/';
export const REDUCER_KEY = 'reducer';

export const getKey = (str: string): string =>
    str.substring(str.indexOf(NAME_SPACE_FLAG) + 1, str.length + 1);


export function createModule<
    Namespace extends string,
    State extends Record<string, unknown>,
    Reducer extends Record<string, (payload: never, state: State) => void>,
    Effect extends any,
    >(options: Options<Namespace, State, Reducer, Effect>) {
    return options as unknown as Reducer;
}

let _store: any;
export const _actionMap: Record<string, Record<string, string>> = {};
export const selectors: any = {};

/*
generate all actions and save in a map ，so you can use actions like actionMap.count.add,
it will be added namespace 'count/add' automatically

_actionMap`s shape:
* count:{
  add: "count/add"
  minus: "count/minus"
* }
* */
export function generateActionMap(
    moduleName: string,
    actionName: string,
    actionNameWithNamespace: string
) {
    //todo 检查是否重复
    _actionMap[moduleName] = {
        ..._actionMap[moduleName],
        [actionName]: actionNameWithNamespace,
    };
}

type EnhanceReducerModuleParams = {
    namespace: string;
    state: unknown;
    action: { type: string; payload: unknown };
    reducer: Record<string, unknown>;
};

/*
 * enhance reducer
 * 1. add namespace
 * 2. add immer
 * */
function enhanceReducerModule(params: EnhanceReducerModuleParams) {
    const { state, action, reducer, namespace = '' } = params;
    return Object.keys(reducer)
        .map((key) => namespace + NAME_SPACE_FLAG + key)
        .includes(action.type)
        ? produce(state, (draft: EnhanceReducerModuleParams['state']) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return reducer[getKey(action.type)](action.payload, draft);
        })
        : state;
}

function processModuleReducer(currentModule: ModuleConfig) {
    const { reducer, namespace } = currentModule;
    const reducerModule = (
        state = currentModule.state,
        action: EnhanceReducerModuleParams['action']
    ) =>
        enhanceReducerModule({
            state,
            action,
            reducer,
            namespace,
        });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    reducerModule[REDUCER_KEY] = getActionMap(reducer, namespace);
    return reducerModule;
}

// function getEffectMap() {}

function getActionMap(reducerModule: ModuleConfig, namespace: string) {
    return Object.keys(reducerModule).reduce((actionMap, actionName) => {
        const actionNameWithNamespace = namespace + NAME_SPACE_FLAG + actionName;
        generateActionMap(namespace, actionName, actionNameWithNamespace);

        return {
            ...actionMap,
            [actionName]: (payload: any) => {
                _store.dispatch({
                    type: actionNameWithNamespace,
                    payload,
                });
            },
        };
    }, {});
}



//generate all reducers and save in a map ，so you can call reducer like reducers.countModule.add()
function generateReducers<Reducers>(reducersToCombine: any): HandleReducers<Reducers> {
    const reducers: MutableObject = {};
    Object.keys(reducersToCombine).forEach((moduleName) => {
        reducers[moduleName] = reducersToCombine[moduleName][REDUCER_KEY];
    });
    return reducers as HandleReducers<Reducers>;
}


// processRootModule shape
// const processRootModule ={
//     count:{
//         reducer: {
//             add(){}
//         }
//     },
//     todos:{
//         reducer: {
//             addTodos(){}
//         }
//     },
// }
function processRootModule<Reducers>(rootModules: Record<string, any>) {
    const processedRootModule = {} ;
    Object.keys(rootModules).forEach((moduleName:string) => {
        const currentModule = rootModules[moduleName]
        const moduleSelectors = currentModule.selector;
        if (moduleSelectors) {
            Object.keys(moduleSelectors).forEach(
                (key) => (selectors[key] = () => moduleSelectors[key](_store.getState()))
            );
        }
        processedRootModule[moduleName] = processModuleReducer(currentModule);
    });
    const reducers = generateReducers<Reducers>(processedRootModule);
    const rootReducer = combineReducers(processedRootModule);

    return {
        reducers,
        rootReducer,
        // processedRootModule
    };

}

export function mountModules(store: any, processedRootModule: any) {
    _store = store;
    Object.keys(processedRootModule).forEach((moduleName) => {
        _store[moduleName] = processedRootModule[moduleName][REDUCER_KEY];
    });
}

export function run<T>(options: RunParams<T>): RunResult<T> {
    const { modules, middlewares = [] } = options;
    const { rootReducer, reducers } = processRootModule<T>(modules);
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares))) as Store; // todo 环境变量,生产环境不打包 dev tools
    _store = store;
    // mountModules(store, processedRootModule);
    return {
        store,
        selectors,
        reducers,
        effects: {},
        actions: _actionMap as HandleActionMap<T>,
    };
}
