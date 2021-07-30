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

interface CreateModuleResult<Reducer,Effect> {
    reducer:Reducer
    effect:Effect
}

export function createModule<
    Namespace extends string,
    State extends Record<string, unknown>,
    Reducer extends Record<string, (payload: never, state: State) => void>,
    Effect extends any,
    >(options: Options<Namespace, State, Reducer, Effect>) {
    return options as unknown as CreateModuleResult<Reducer,Effect> ;
}

let _store: any;
const _actions: Record<string, Record<string, string>> = {};
const selectors: any = {};
const reducers:MutableObject ={}
const _effects ={}
const _reducersToCombine = {} ;
let _rootReducers:any = {} ;


/*
generate all actions and save in a object ，
so you can use actions like actions.count.add,
it will be added namespace 'count/add' automatically

actions`s shape:
* count:{
  add: "count/add"
  minus: "count/minus"
* }
* */
export function generateActions(
    moduleName: string,
    actionName: string,
    actionNameWithNamespace: string
) {
    //todo 检查是否重复
    _actions[moduleName] = {
        ..._actions[moduleName],
        [actionName]: actionNameWithNamespace,
    };
}

type EnhanceModuleReducerParams = {
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
function enhanceModuleReducer(params: EnhanceModuleReducerParams) {
    const { state, action, reducer, namespace = '' } = params;
    return Object.keys(reducer)
        .map((key) => namespace + NAME_SPACE_FLAG + key)
        .includes(action.type)
        ? produce(state, (draft: EnhanceModuleReducerParams['state']) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return reducer[getKey(action.type)](action.payload, draft);
        })
        : state;
}



function processModuleReducer(currentModule: ModuleConfig) {
    const { reducer:currentModuleReducer, namespace } = currentModule;
    const enhancedReducer = (
        state = currentModule.state,
        action: EnhanceModuleReducerParams['action']
    ) =>
        enhanceModuleReducer({
            state,
            action,
            reducer:currentModuleReducer,
            namespace,
        });
    reducers[namespace]=generateReducersWithStoreDispatch(currentModuleReducer, namespace);
    _reducersToCombine[namespace] = enhancedReducer
    _rootReducers = combineReducers(_reducersToCombine)
    return enhancedReducer;
}

//返回 reducers，使用户可以这样使用：reducer.count.add()
//内部将会自动代理成 _store.dispatch('count/add')
function generateReducersWithStoreDispatch(currentModuleReducer: ModuleConfig['reducer'], namespace: string) {
    return Object.keys(currentModuleReducer).reduce((actions, reducerName) => { // actions: 存放所有 action 的对象
        const reducerNameWithNamespace = namespace + NAME_SPACE_FLAG + reducerName; // like count/add
        generateActions(namespace, reducerName, reducerNameWithNamespace);
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

// function processModuleSelector(currentModule: ModuleConfig) {
//     const moduleSelectors = currentModule.selector;
//     if (moduleSelectors) {
//         Object.keys(moduleSelectors).forEach(
//             (key) => (selectors[key] = () => moduleSelectors[key](_store.getState()))
//         );
//     }
// }

function processModuleEffect(currentModule: ModuleConfig) {
    const { effect:currentModuleEffect, namespace } = currentModule;
    _effects[namespace] =currentModuleEffect
}

function processRootModule(rootModule: Record<string, any>) {
    Object.keys(rootModule).forEach((namespace:string) => {
        const currentModule = rootModule[namespace]
        processModuleReducer(currentModule);
        processModuleEffect(currentModule);
        // processModuleSelector(currentModule)
    });
}

export function run<Reducers,Effects>(options: RunParams<Reducers>): RunResult<Reducers,Effects> {
    const { modules, middlewares = [] } = options;
    processRootModule(modules);
    const store = createStore(_rootReducers, composeWithDevTools(applyMiddleware(...middlewares))) as Store; // todo 环境变量,生产环境不打包 dev tools
    _store = store;

    return {
        store,
        selectors,
        reducers:reducers as HandleReducers<Reducers>,
        effects: _effects as HandleReducers<Effects>,
        actions: _actions as HandleActionMap<Reducers>,
    };
}
