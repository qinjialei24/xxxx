import {countModule,CountModule} from "./modules/count";
import {run} from "redux-brief";

interface ReduxBriefReducers {
    count:CountModule['reducer']
}

const {store,reducers} = run<ReduxBriefReducers>({
    modules:{
        count:countModule,
    },
    middlewares:[]//例如 middlewares:[thunk，saga]，默认集成 redux-devtools-extension
})

export {
    store,
    reducers,
}

