export default function todos(state = [], action:any) {
    switch (action.type) {
        case 'ADD_TODO':
            // @ts-ignore
            return state.concat([action.text])
        default:
            return state
    }
}
