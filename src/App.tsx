import React from 'react';

import store, {reducerMap} from "./store";

function App() {
  // const [todos, setTodos] = React.useState(store.getState().todos);
  store.subscribe(() => {
    // setTodos(store.getState().todos)
      console.log("-> store.getState()", store.getState());
  })

  return (
    <div className="App">
      <button onClick={() => {
          reducerMap.count.add(1)

        //   store.dispatch({
        //   type:'ADD_TODO',
        //   text:'1111'
        // })

      }}>add todo</button>

      <h1>todos:</h1>
      {/*<h2>{todos}</h2>*/}
    </div>
  );
}

export default App;
