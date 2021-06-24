import React from 'react';
import { useSelector} from 'react-redux'
import { reducerMap } from "./store";

function App() {
    const money = useSelector((state: any) => state.count.money)

    const renderCount = () => {
        return (
            <div style={{border:'1px solid',padding:'10px'}}>
                <button onClick={() => {
                    reducerMap.count.add(1)
                }}>
                    加
                </button>
                <h1>money:{money}</h1>
                <button onClick={() => {
                    reducerMap.count.minus(1)
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
