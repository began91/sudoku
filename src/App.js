import React, { useState } from 'react';
import {useSelector, useDispatch } from 'react-redux'
import { getSolution } from './features/square/helper';
import './App.css';
import { setSolution, resetPuzzle } from './features/square/squareSlice';
import { Board } from './components/Board';


function App() {
  let dispatch = useDispatch();
  let isSolvable = useSelector(state => state.square.isSolvable);
  const [isSolved, setSolved] = useState(false);
  
  const squares = useSelector(state=> state.square.board);
  
  const solve = e => {
    let solvedPuzzle = getSolution(squares);
    dispatch(setSolution(solvedPuzzle));
    setSolved(true);
  }

  const reset = e => {
    setSolved(false);
    dispatch(resetPuzzle());
  }

  return (
    <div className="App">
      <header className="App-header">
        React Sudoku
      </header>
        <Board/>
        {!isSolved ? 
        <button onClick={solve} disabled={!isSolvable}>{isSolvable ? 'Solve!' : 'No Solution!'}</button> :
        <button onClick={reset}>Reset</button>
        }
    </div>
  );
}

export default App;
