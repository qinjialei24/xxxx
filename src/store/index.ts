import {countModule, CountModuleState} from "./modules/count";
import {userModule, UserModuleState} from "./modules/user";

import thunk from 'redux-thunk'
import {run} from "../redux-brief";

interface Reducers {
    count:typeof countModule.reducer
    user:typeof userModule.reducer
}

interface Effects {
    count:typeof countModule.effect
    user:typeof userModule.effect
}

const {store,reducers,actions,effects} = run<Reducers,Effects>({
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
    effects
}

export type AppState =UserModuleState & CountModuleState
