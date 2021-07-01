import {createModule} from 'redux-brief'

const namespace ='user'
const state = {
    name: '',
    age: 0
}

export const userModule = createModule(
    {
        namespace:'user',
        state: {
            name: '',
            age: 0
        },
        reducer: {
            setUserName(name:string, state) {
                state.name = name
            },
            setAge(age:number, state) {
                state.age = age
            },
        },
    }
)

export type UserModuleState = {
    [namespace]:typeof state
}
