import {createModule} from "redux-brief";

const state = {
    money: 10,
    count: 10,
    count2: '',
}

const namespace = 'count'

export const countModule = createModule({
        namespace,
        state,
        reducer: {
            add(payload: number, state) {
                state.money += payload
            },
            add2(payload: string, state) {
                state.count2 += payload
            },
            minus(payload: number, state) {
                state.money -= 1
            },
        }
    }
)

export type CountModuleState ={
    [namespace]: typeof state
}
