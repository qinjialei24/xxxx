import childModule, {ChildModule} from "./child1";

export interface CountModule {
    namespace: 'count'
    state: {
        money: number
    }
    reducer: {
        add: (payload: number, state: CountModule['state']) => void
        minus: (payload: number, state: CountModule['state']) => void
    }
}

const countModule: CountModule & ChildModule = {
    namespace: 'count',
    state: {
        money: 10,
        ...childModule.state
    },
    reducer: {
        add(payload, state) {
            console.log("-> payload", payload);

            state.money += payload
        },
        minus(payload, state) {
            state.money -= payload
        },
        ...childModule.reducer
    }
}

export default countModule
