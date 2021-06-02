import  {CountModule} from './modules/count'
import countModel from "./modules/count";
import {getReducerMap, processReducerModules, setActionToStore} from "../redux-brief";
import {combineReducers, createStore} from "redux";
import todos from "../reducers/todo";
import {ChildModule} from "./modules/child1";

interface ReduxBriefReducers {
    count:CountModule['reducer'] & ChildModule['reducer']
}

const reduxBriefModules = processReducerModules({
    count:countModel
})

const rootReducer =combineReducers({
    todos,
    ...reduxBriefModules
})
const reducerMap = getReducerMap<ReduxBriefReducers>(reduxBriefModules);
const store= createStore(rootReducer)
setActionToStore(store, reduxBriefModules);

export {
    store,
    reduxBriefModules,
    reducerMap
}
