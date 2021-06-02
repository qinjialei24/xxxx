export interface ChildModule {
    namespace: string
    state: {
        money1: number
    }
    reducer: {
        add1: (payload: number, state: ChildModule['state']) => void
        minus1: (payload: number, state: ChildModule['state']) => void
    }
}


const childModule: ChildModule = {
    namespace: 'child',
    state: {
        money1: 100
    },
    reducer: {
         add1(payload, state) {
            state.money1 += payload
        },
        minus1(payload, state) {
            state.money1 -= payload
        },
    }
}


export default childModule
