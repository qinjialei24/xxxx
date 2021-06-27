import {countModule, CountModuleState} from "./modules/count";
import {userModule, UserModuleState} from "./modules/user";

import {run} from "redux-brief";
import thunk from 'redux-thunk'

interface Modules {
    count:typeof countModule
    user:typeof userModule
}

const {store,reducers} = run<Modules>({
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
