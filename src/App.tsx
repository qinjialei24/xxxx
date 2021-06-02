import React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {reducerMap} from "./store";

function App() {
    const todos = useSelector((state: any) => {
        return state.todos
    });

    const money = useSelector((state: any) => state.count.money)

    const dispatch = useDispatch()

    const renderCount = () => {
        return (
            <div>
                <button onClick={() => {
                    reducerMap.count.add(1)
                }}>加钱
                </button>
                <h1>money:{money}</h1>
            </div>
        )
    }

    const renderTodos = () => {
        return (
            <div>
                <button onClick={() => {
                    const action = {
                        type: 'ADD_TODO',
                        text: '1111'
                    }
                    dispatch(action)
                }}
                >
                    add todo
                </button>
                <h1>todos</h1>
                {todos}
            </div>
        )
    }

    return (
        <div className="App">
            {renderCount()}
            {renderTodos()}
        </div>
    );
}

export default App;
