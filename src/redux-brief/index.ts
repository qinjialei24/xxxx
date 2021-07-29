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
const actions: Record<string, Record<string, string>> = {};
const selectors: any = {};

/*
generate all actions and save in a map ，so you can use actions like actionMap.count.add,
it will be added namespace 'count/add' automatically

actions`s shape:
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
    actions[moduleName] = {
        ...actions[moduleName],
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

function processCurrentModuleReducer(currentModule: ModuleConfig) {
    const { reducer, namespace } = currentModule;
    const enhancedReducer = (
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
    enhancedReducer[REDUCER_KEY] = processReducerWithStoreDispatch(reducer, namespace);
    console.log("-> reducerModule[REDUCER_KEY]", enhancedReducer[REDUCER_KEY]);
    return enhancedReducer;
}

// 处理 reducer，使之可以 将 reducer.count.add() 代理成 _store.dispatch('count/add')
function processReducerWithStoreDispatch(currentModuleReducer: ModuleConfig, namespace: string) {
    return Object.keys(currentModuleReducer).reduce((actions, reducerName) => { // actions: 存放所有 action 的对象
        const reducerNameWithNamespace = namespace + NAME_SPACE_FLAG + reducerName; // like count/add
        generateActionMap(namespace, reducerName, reducerNameWithNamespace);
        return {
            ...actions,
            [reducerName]: (payload: any) => {
                _store.dispatch({
                    type: reducerNameWithNamespace,
                    payload,
                });
            },
        };
    }, {});
}



//generate all reducers and save in a object ，so you can call reducer like reducers.countModule.add()
function generateReducers<Reducers>(processedRootModule: any): HandleReducers<Reducers> {
    const reducers: MutableObject = {};
    Object.keys(processedRootModule).forEach((moduleName) => {
        reducers[moduleName] = processedRootModule[moduleName][REDUCER_KEY];
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
        processedRootModule[moduleName] = processCurrentModuleReducer(currentModule);
    });
    const reducers = generateReducers<Reducers>(processedRootModule);
    const rootReducer = combineReducers(processedRootModule);

    return {
        reducers,
        rootReducer,
        // processedRootModule
    };

}

// export function mountModules(store: any, processedRootModule: any) {
//     _store = store;
//     Object.keys(processedRootModule).forEach((moduleName) => {
//         _store[moduleName] = processedRootModule[moduleName][REDUCER_KEY];
//     });
// }

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
        actions: actions as HandleActionMap<T>,
    };
}
