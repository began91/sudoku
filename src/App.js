import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch } from 'react-redux'
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import { Square } from './features/square/Square';
//import { setSquare } from './features/square/squareSlice';
import { getSolution } from './features/square/helper';
import './App.css';
import { setSolvable, setSolution, resetPuzzle } from './features/square/squareSlice';


function App() {
  let dispatch = useDispatch();
  let isSolvable = useSelector(state => state.square.isSolvable);
  const [solvedPuzzle, setSolvedPuzzle] = useState({});
  const [isSolved, setSolved] = useState(false);
  
  const Box = props => {
    let box = props.box;
    let i = box-1;
    let squares = [];
    for (let j=0; j<9; j++) {
      let row = (Math.floor(i/3)*3 + 1) + Math.floor(j/3);
      let col = ((i % 3) * 3) + 1 + (j % 3);
      let square = String(row)+String(col);
      squares.push(<Square 
        box={box} row={row} col={col} 
        key={square} square={square}/>)
    }
    return (
      <td className="box">
        {squares}
      </td>
    )
  }

  const Board = props => {
    let boxes = []
    for (let i = 0; i < 3; i++) {
      let box1=i*3 + 1;
      boxes.push(
      <tr key={i}>
        <Box box={box1} />
        <Box box={box1+1} />
        <Box box={box1+2} />
      </tr>
      );
    }
    return (
      <table className="board">
        <tbody>
          {boxes}
        </tbody>
      </table>
    );
  }
  
  const squares = useSelector(state=> state.square.board);
  
  useEffect(() => {
    let a = setSolvedPuzzle(getSolution(squares));
    if (!a) {
      setSolvable(false)
    }
  }, [squares]);
  
  const solve = e => {
    setSolved(true);
    dispatch(setSolution(solvedPuzzle));
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
