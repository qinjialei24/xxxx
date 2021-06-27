import {countModule} from "./modules/count";
import {run} from "redux-brief";
import thunk from 'redux-thunk'

interface ReduxBriefReducers {
    count:typeof countModule
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

