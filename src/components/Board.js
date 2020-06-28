import React from 'react';
import { Square } from '../features/square/Square';


export const Board = props => {
    const Box = props => {
        let i = props.box-1;
        let squares = [];
        for (let j=0; j<9; j++) {
            //give squares naming convention `${row}${col}`
            let row = (Math.floor(i/3)*3 + 1) + Math.floor(j/3);
            let col = ((i % 3) * 3) + 1 + (j % 3);
            let square = String(row)+String(col);
            squares.push(<Square 
                row={row} col={col} 
                key={square} square={square}/>)
        }
        return (
          <td className="box">
            {squares}
          </td>
        )
    }
    
    return (
      <table className="board">
        <tbody>
            <tr>
                <Box box={1} />
                <Box box={2} />
                <Box box={3} />
            </tr>
            <tr>
                <Box box={4} />
                <Box box={5} />
                <Box box={6} />
            </tr>
            <tr>
                <Box box={7} />
                <Box box={8} />
                <Box box={9} />
            </tr>
        </tbody>
      </table>
    );
}