import React from 'react';
import { useSelector,useDispatch } from 'react-redux'

// import store, {reducerMap} from "./store";

function App() {
    const todos =useSelector((state:any)=>{
        console.log("-> state", state);

        return state.todos
    });
    const dispatch = useDispatch()

  return (
    <div className="App">
      <button onClick={() => {
          // reducerMap.count.add(1)
          const action ={
              type:'ADD_TODO',
              text:'1111'
          }
          dispatch(action)
      }}>add todo</button>

        <h1>todos</h1>
        {todos}

    </div>
  );
}

export default App;
