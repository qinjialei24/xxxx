import {countModule, CountModuleState} from "./modules/count";
import {userModule, UserModuleState} from "./modules/user";

import thunk from 'redux-thunk'
import {run} from "../redux-brief";

interface Modules {
    count:typeof countModule
    user:typeof userModule
}

const {store,reducers,actions} = run<Modules>({
    modules:{
        count:countModule,
        user:userModule,
    },
    middlewares:[thunk]
})

export {
    store,
    reducers,
    actions,
}

export type AppState =UserModuleState & CountModuleState
