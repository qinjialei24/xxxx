import {createModule} from "redux-brief";

export const countModule = createModule({
    namespace:'1',
    state: {
            money: 10,
            count: 10,
            count2: '',
        },
      reducer: {
            add(payload:number, state) {
                state.money += payload
            },
            add2(payload:string, state) {
                state.count2 += payload
            },
            minus(payload:number, state) {
                state.money -= 1
            },
        }
    }
)

