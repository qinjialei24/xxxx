import { run } from "redux-brief";
import { createStore,combineReducers } from 'redux'
import count, {CountModule} from './modules/count'
import todos from "../reducers/todo";

interface ReduxBriefReducers {
    count:CountModule['reducer']
}

const reduxBriefModules ={
    count
} as any;

const rootReducer = combineReducers({
    todos,
    ...reduxBriefModules
})


const store =createStore(rootReducer)

export const reducerMap =run<ReduxBriefReducers>(reduxBriefModules,store)


export default store
