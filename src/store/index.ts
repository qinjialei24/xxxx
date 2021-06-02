import  {CountModule} from './modules/count'
import countModel from "./modules/count";
import { processReducerModules, run} from "../redux-brief";
import {combineReducers, createStore} from "redux";
import todos from "../reducers/todo";
import {ChildModule} from "./modules/child1";

interface ReduxBriefReducers {
    count:CountModule['reducer'] & ChildModule['reducer']
}

const {reduxBriefModules,reducerMap} = processReducerModules<ReduxBriefReducers>({
    count:countModel
})


const rootReducer =combineReducers({
    todos,
    ...reduxBriefModules
})

const store= createStore(rootReducer)

run(store, reduxBriefModules);

export {
    store,
    reduxBriefModules,
    reducerMap
}
