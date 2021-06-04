import  {CountModule} from './modules/count'
import countModel from "./modules/count";
import { processReducerModules, run} from "../redux-brief";
import {combineReducers,applyMiddleware, createStore} from "redux";
import createSagaMiddleware from 'redux-saga'

import todos from "../reducers/todo";
import user, {User} from "./modules/user";
import { composeWithDevTools } from 'redux-devtools-extension';
import mySaga from "./saga";
const sagaMiddleware = createSagaMiddleware()

interface ReduxBriefReducers {
    count:CountModule['reducer']
    user:User['reducer']
}

const {reduxBriefModules,reducerMap,actionMap} = processReducerModules<ReduxBriefReducers>({
    count:countModel,
    user
})

const rootReducer =combineReducers({
    todos,
    ...reduxBriefModules
})

const store= createStore(rootReducer,composeWithDevTools(
    applyMiddleware(sagaMiddleware)
))

sagaMiddleware.run(mySaga)

run(store, reduxBriefModules);

export {
    store,
    reduxBriefModules,
    reducerMap,
    actionMap
}
