import React from 'react';
import { useSelector} from 'redux-brief'
import {AppState, reducers, store} from "./store";

function App() {
    const money = useSelector((state: AppState) => state.count.money)
    const name = useSelector((state: AppState) => state.user.name)

    function minusAsync() {
        return (dispatch) => {
            console.log("-> dispatch", dispatch);
            setTimeout(() => {
                dispatch({
                    type:'count/minus'
                });
            }, 1000);
        };
    }

    const renderCount = () => {
        return (
            <div style={{border:'1px solid',padding:'10px'}}>
                <button onClick={() => {
                    reducers.count.add(1)
                    reducers.user.setUserName('kobe bryant')
                }}>
                    加
                </button>
                <h1>money:{money}</h1>
                <h1>name:{name}</h1>
                <button onClick={() => {
                    store.dispatch(minusAsync() as any)
                }}>
                    减
                </button>
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
