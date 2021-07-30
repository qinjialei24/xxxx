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
const reducers:MutableObject ={}

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
    reducers[namespace]=generateReducersWithStoreDispatch(reducer, namespace);
    return enhancedReducer;
}

//返回 reducers，使用户可以这样使用：reducer.count.add()
// 内部将会自动代理成 _store.dispatch('count/add')
function generateReducersWithStoreDispatch(currentModuleReducer: ModuleConfig, namespace: string) {
    return Object.keys(currentModuleReducer).reduce((actions, reducerName) => { // actions: 存放所有 action 的对象
        const reducerNameWithNamespace = namespace + NAME_SPACE_FLAG + reducerName; // like count/add
        generateActionMap(namespace, reducerName, reducerNameWithNamespace);
        const reducerWithStoreDispatch ={
            ...actions,
            [reducerName]: (payload: any) => {
                _store.dispatch({
                    type: reducerNameWithNamespace,
                    payload,
                });
            },
        };
        console.log("-> reducers", reducers);
        return reducerWithStoreDispatch
    }, {});
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
function processRootModule(rootModules: Record<string, any>) {
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
    const rootReducer = combineReducers(processedRootModule);

    return {
        rootReducer,
    };

}

export function run<Reducers>(options: RunParams<Reducers>): RunResult<Reducers> {
    const { modules, middlewares = [] } = options;
    const { rootReducer } = processRootModule(modules);
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares))) as Store; // todo 环境变量,生产环境不打包 dev tools
    _store = store;

    return {
        store,
        selectors,
        reducers:reducers as HandleReducers<Reducers>,
        effects: {},
        actions: actions as HandleActionMap<Reducers>,
    };
}
