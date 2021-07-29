import {createModule} from "../../redux-brief";
import {reducers} from "../index";

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
                state.money -= payload
            },
        },
        effect:{
            asyncAdd(payload:any){
                setTimeout(() => {
                    reducers.count.add(payload)
                },1000)
            }
        }
        // effects:{
        //    add(reducer){
        //        setTimeout(() => {
        //            reducer.add(1)
        //        },1000)
        //    }
        // }
    }
)

export type CountModuleState ={
    [namespace]: typeof state
}
