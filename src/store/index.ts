import  {CountModule} from './modules/count'
import countModel from "./modules/count";
import {getReducerMap, setActionToStore} from "../redux-brief";
import {combineReducers, createStore} from "redux";
import todos from "../reducers/todo";

interface ReduxBriefReducers {
    count:CountModule['reducer']
}

const reduxBriefModules ={
    count:countModel
};
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
