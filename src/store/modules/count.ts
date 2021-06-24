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

export const countModule: CountModule= {
    namespace: 'count',
    state: {
        money: 10,
    },
    reducer: {
        add(payload, state) {
            state.money += payload
        },
        add2(payload, state) {
            state.money += payload
        },
        minus(payload, state) {
            state.money -= payload
        },
    }
}

