import {countModule,CountModule} from "./modules/count";
import { processReducerModules, run,combineReducers,createStore,composeWithDevTools } from "redux-brief";

import  {userModule,User} from "./modules/user";

interface ReduxBriefReducers {
    count:CountModule['reducer']
    user:User['reducer']
}

const {reduxBriefModules,reducers,actionMap} = processReducerModules<ReduxBriefReducers>({
    count:countModule,
    user:userModule
})

const rootReducer =combineReducers({
    ...reduxBriefModules
})

const store= createStore(rootReducer,composeWithDevTools())

run(store, reduxBriefModules);

export {
    store,
    reduxBriefModules,
    reducers,
    actionMap
}
