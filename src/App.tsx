import React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {reducerMap} from "./store";

function App() {
    const todos = useSelector((state: any) => {
        return state.todos
    });

    const money = useSelector((state: any) => state.count.money)
    const money1 = useSelector((state: any) => state.count.money1)

    const dispatch = useDispatch()

    const renderCount = () => {
        return (
            <div>
                <button onClick={() => {
                    reducerMap.count.add(12)
                }}>加钱
                </button>
                <h1>money:{money}</h1>

                <button onClick={() => {
                    reducerMap.count.add1(12)
                }}>
                    加钱1
                </button>
                <h1>money1:{money1}</h1>
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
