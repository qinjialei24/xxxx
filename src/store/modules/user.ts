import {createModule} from "../../redux-brief";

interface Info {
    address:string
    age:number
}

const namespace ='user'

const state = {
    name: '',
    age: 0,
    info:{address:'wuhan',age:18} as Info
}

export const userModule = createModule(
    {
        namespace:'user',
        state,
        reducer: {
            setUserName(name:string, state) {
                state.name = name
            },
            setAge(age:number, state) {
                state.age = age
            },
            setInfo(info:Info, state) {
                state.info = info
            },
        },
    }
)

export type UserModuleState = {
    [namespace]:typeof state
}
