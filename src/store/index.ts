import  {CountModule} from './modules/count'
import countModel from "./modules/count";
import { processReducerModules, run} from "../redux-brief";
import {combineReducers, createStore} from "redux";
import todos from "../reducers/todo";
import user, {User} from "./modules/user";
import { composeWithDevTools } from 'redux-devtools-extension';

interface ReduxBriefReducers {
    count:CountModule['reducer']
    user:User['reducer']
}

const {reduxBriefModules,reducerMap} = processReducerModules<ReduxBriefReducers>({
    count:countModel,
    user
})


const rootReducer =combineReducers({
    todos,
    ...reduxBriefModules
})

const store= createStore(rootReducer,composeWithDevTools())

run(store, reduxBriefModules);

export {
    store,
    reduxBriefModules,
    reducerMap
}
