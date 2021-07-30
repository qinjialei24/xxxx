import React from 'react';
import {actions, AppState, effects, reducers, store} from "./store";
import {useSelector} from "react-redux";

function App() {
    const money = useSelector((state: AppState) => state.count.money)
    const name = useSelector((state: AppState) => state.user.name)

    function minusAsync() {
        return (dispatch) => {
            setTimeout(() => {
                dispatch({
                    type:actions.count.minus,
                    payload:10
                });
            }, 1000);
        };
    }

    const renderCount = () => {
        return (
            <div style={{border:'1px solid',padding:'10px'}}>
                <button onClick={() => {
                    // effects.asyncAdd(10)
                    reducers.count.add(2)
                    // reducers.user.setUserName('kobe bryant')
                    // reducers.user.setInfo({age:1,address:''})
                }}>
                    加
                </button>
                <h1>money:{money}</h1>
                <button onClick={() => {
                   effects.count.asyncAdd(10)
                }}>
                    异步➕
                </button>
                <h1>name:{name}</h1>
            </div>
        )
    }

    return (
        <div className="App">
            {renderCount()}
        </div>
    );
}

export default App;
