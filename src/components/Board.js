import React from 'react';
import { Square } from '../features/square/Square';
import { squaresIn } from '../features/square/helper';


export const Board = props => {
    const Box = props => {
        let squares = squaresIn('box', props.box).map(square => {
          return (
            <Square row={square[0]} col={square[1]}
            key={square} square={square}/>
          );
        });

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