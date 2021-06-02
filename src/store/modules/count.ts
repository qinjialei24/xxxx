import {reducerMap} from "../index";

export interface CountModule {
    namespace: 'count'
    state: {
        money: number
    }
    reducer: {
        add: (payload: number, state: CountModule['state']) => void
        add2: (payload: number, state: CountModule['state']) => void
        minus: (payload: number, state: CountModule['state']) => void
    }
}

const countModule: CountModule= {
    namespace: 'count',
    state: {
        money: 10,
    },
    reducer: {
        add(payload, state) {
            console.log("-> payload", payload);
            // reducerMap.user.setUserName('111')
            console.log("-> reducerMap", reducerMap.user);
            state.money += payload
        },
        add2(payload, state) {
            console.log("-> payload", payload);
            // reducerMap.user.setUserName('111')
            console.log("-> reducerMap", reducerMap.user);
            state.money += payload
        },
        minus(payload, state) {
            state.money -= payload
        },
    }
}

export default countModule
