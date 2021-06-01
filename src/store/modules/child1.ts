
export interface ChildModule{
    namespace:'count'
    state:{
        money1:number
    }
    reducer:{
        add1: (payload:number,state:ChildModule['state']) =>void
        minus1: (payload:number,state:ChildModule['state']) =>void
    }
}


const childModule:ChildModule = {
    namespace:'count',
    state:{
        money1:0
    },
    reducer:{
        add1(payload,state){
            state.money1+=payload
        },
        minus1(payload,state){
            state.money1-=payload
        },
    }
}



export default childModule
