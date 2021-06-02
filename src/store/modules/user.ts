
export interface User {
    namespace: 'user'
    state: {
        name: string
        age:number
    }
    reducer: {
        setUserName: (name: string, state: User['state']) => void
        setAge: (age: number, state: User['state']) => void
    },
    effect:{
        asyncAdd: (payload: any, dispatch: Function) =>void
    }
}

const user: User = {
    namespace: 'user',
    state: {
        name: '',
        age:0
    },
    reducer: {
        setUserName(name, state) {
            state.name = name
        },
        setAge(age, state) {
            state.age = age
        },
    },
    effect:{
        asyncAdd(payload,dispatch){

        }
    }

}

export default user
