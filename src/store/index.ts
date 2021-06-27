import {countModule, CountModuleState} from "./modules/count";
import {userModule, UserModuleState} from "./modules/user";

import {run} from "redux-brief";
import thunk from 'redux-thunk'

interface ReduxBriefReducers {
    count:typeof countModule
    user:typeof userModule
}

const {store,reducers} = run<ReduxBriefReducers>({
    modules:{
        count:countModule,
        user:userModule,
    },
    middlewares:[thunk]
})

export {
    store,
    reducers,
}

export type AppState =UserModuleState & CountModuleState
