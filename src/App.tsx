import React from 'react';
import { useSelector} from 'redux-brief'
import {reducers, store} from "./store";

function App() {
    const money = useSelector((state: any) => state.count.money)

    function minusAsync() {
        return (dispatch) => {
            console.log("-> dispatch", dispatch);
            setTimeout(() => {
                // Yay! Can invoke sync or async actions with `dispatch`
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
                }}>
                    加
                </button>
                <h1>money:{money}</h1>
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
