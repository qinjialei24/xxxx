import {countModule,CountModule} from "./modules/count";
import {run} from "redux-brief";
import thunk from 'redux-thunk'

interface ReduxBriefReducers {
    count:CountModule['reducer']
}

const {store,reducers} = run<ReduxBriefReducers>({
    modules:{
        count:countModule,
    },
    middlewares:[thunk]
})

export {
    store,
    reducers,
}

