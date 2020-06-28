//import { useEffect } from 'react';
//import { useSelector } from 'react-redux';
import { setSolution, setSolvable } from './squareSlice';

export const neighborsOf = square => {
    let neighbors = []
    let row = Number(square[0]);
    let col = Number(square[1]);
    let box = Math.floor((row-1)/3)*3 + 1 + Math.floor((col-1)/3)
    for (let i = 0; i<9; i++) {
        //row
        neighbors.push(String(row) + String(i+1));
        
        //col
        neighbors.push(String(i+1) + String(col));

        //box
        let boxRow = (Math.floor((box-1)/3)*3 + 1) + Math.floor(i/3);
        let boxCol = (((box-1) % 3)*3) + 1 + (i % 3);
        neighbors.push(String(boxRow)+String(boxCol))
    }
    //console.log([...new Set(neighbors.filter(neighbor => neighbor!==square))]); 
    return ([...new Set(neighbors.filter(neighbor => neighbor!==square))]); 
}

export const getSolution = (squares) => {
    squares = {...squares};
    const getPossibleValuesInSolution = (square, solvedSquares) => {
        let possVals = [1,2,3,4,5,6,7,8,9]
        neighborsOf(square).forEach(neighbor => {
            let neighborVal = solvedSquares[neighbor];
            if (neighborVal && possVals.includes(neighborVal)) {
                possVals = possVals.filter(num => num !==neighborVal)
            }
        })
        return possVals;
    }
    
    const fitsWithNeighbors = (square, newValue) => {
        return !neighborsOf(square).some(neighbor => squares[neighbor] === newValue)
    }
    
    let filled = Object.entries(squares).filter(([square,value]) => !!value);
    if (filled.filter(([square,value]) => !fitsWithNeighbors(square,value)).length !==0) {
        setSolvable(false); //not solvable
    } else {
        setSolution(squares);
    };
    
    //for each empty square
    // let empties = Object.entries(squares).filter(([square,value]) => !value).map(([square,value]) => square); //list of string corresponding to empty squares
    
    const findSolution = solvedSquares => {
        let index = Object.entries(solvedSquares).findIndex(([square,value]) => !value)
        //if theres no empty, there's nothing to evaluate. The solution is good
        if (index === -1) {
            let isSolved = true;
            let isSolvable = true;
            return ([solvedSquares, isSolved, isSolvable]); //solvedsquares, isSolved, isSolvable
        }

        let empty = Object.entries(solvedSquares)[index][0];
        let isSolved = false;
        let isSolvable = true;
        // console.log(`Solving for ${empty}`);

        //if the puzzle isnt impossible, and it hasn't been solved yet
        while (isSolvable && !isSolved) {
            //console.log(empty);
            //find all possible options for that box
            let possVals = getPossibleValuesInSolution(empty, solvedSquares);
            // console.log(`${empty}: ${possVals}`)
            //if there are options and the puzzle isnt solved yet
            while ((possVals.length > 0) && !isSolved) {
                //console.log(possVals);
                //try the first possible option for that box
                let tryVal = possVals.shift();
                // console.log(`Trying: ${tryVal} in ${empty}`);
                solvedSquares[empty] = tryVal;
                //find a solution for a set with the first box solved
                [solvedSquares, isSolved, isSolvable] = findSolution(solvedSquares);
                if (!isSolvable) {
                    //emptyList.unshift(empty);
                }
            }
            if (possVals.length === 0 && !isSolved) {
                // console.log(`No available values for ${empty}! Going back to previous.`)
                // console.log(`adding ${empty} back to list`);
                solvedSquares[empty] = '';
                
                isSolvable = false;
                // console.log(`Returning, isSolvable=${isSolvable} for ${empty}`)
            }
            return ([solvedSquares, isSolved, isSolvable]);
        }
    }
    
    let [ a, b, c] = findSolution(squares)
    console.log(b ? 'solved': 'unsolved', c ? 'solvable' : 'unsolvable');
    return b ? a : null;
    //setSolution(solution);
    //setSolvable(isSolvable);
}


// const solve = () => {
//     let squares = useSelector(state=>state.square);
    
//     //make sure currently filled squares make sense
//     tryToSolve(empties);
//     //check if that square can be set to a value
//     //  if yes and no more squares
//     //      return true;
//     //  if yes and more squares
//     //      check next square
//     //  if no try next value
//     //  if no more values return false
//     if (fitsWithNeighbors(square, 1)) {//check if clicked option works
        
//     } else {
//         return false;
//     }
//     //console.log(empties);
//     return 
// }