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
    let solvable = true;
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
        solvable = false;
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
            console.count('badguess')
            return ([solvedSquares, isSolved, isSolvable]);
        }
    }
    
    if (solvable) {
        let [ a, b, c] = findSolution(squares)//solvedsquares, isSolved, isSolvable
        console.log(b ? 'solved': 'unsolved', c ? 'solvable' : 'unsolvable');
        return b ? a : null;
    } else {
        console.log('unsolvable');
        return null;
    }
    //setSolution(solution);
    //setSolvable(isSolvable);
}
// 
// 
// 
// 
// 
// 
// 
// 
export const getSortSolution = (squares) => {
    let solvable = true;
    squares = {...squares};//make a copy
    //squares is of the form {'11':value, '12': value}
    //change squares to {'11': {value: value, possVals: [], neighbors: []}}
    //start with a smart squares object, each square knows who its neighbors are and what possible values it can have.
    let squareKeys = Object.keys(squares);

    Object.entries(squares).forEach(([square,value]) => {
        squares[square] = {
            value,
            possVals: [],//populated next
            neighbors: neighborsOf(square)
        }
    });
    
    //define all possible values for squares
    squareKeys.forEach(square=> {
        let possVals = [1,2,3,4,5,6,7,8,9];
        let neighbors = squares[square].neighbors;
        neighbors.forEach(neighbor => {
            let neighborVal = squares[neighbor].value;
            if (neighborVal && possVals.includes(neighborVal)) {
                possVals = possVals.filter(num => num !== neighborVal)
            }
        })
        if (possVals.length ===0) {//if theres a square with no possible value the puzzle is unsolvable
            solvable = false
        }
        squares[square].possVals = possVals;
    });
    
    const findSolution = currentSquares => {
        //returns currentSquares if they are good, returns false if they are not
        
        //second time through, the empty keys will not include any squares that were assigned a value
        let emptyKeys = Object.keys(currentSquares).filter(square => !currentSquares[square].value);
        //if there are no empty squares, there's nothing to evaluate. The solution is good
        if (emptyKeys.length===0) {
            // console.log('No empty keys: Solution Verified!')
            return currentSquares; //currentSquares, isSolved, isSolvable
        }
        // console.log(`Solving for: ${emptyKeys}`);
        
        //if any empty square has no possible values, the solution is bad
        if (emptyKeys.some(square => currentSquares[square].possVals.length === 0)) {
            // console.log('Squares exist with no possible values.');
            console.count('badguess')
            return false; //currentSquares, isSolved, isSolvable
        }
        
        //get the first empty square sorted by lowest number of possible values
        //2nd time, fewer empty squares and possible values
        //Creative solution later: 
            //sort again by squares with possible values needed in the fewest places on the board
            //(only two squares need a 1 type logic) 
            //https://coderwall.com/p/ebqhca/javascript-sort-by-two-fields
            // return a-b || c-d to do a double sort
            // if a and b are equal, it will sort based on c and d
            //need to create values c/d that correspond to the overall entropy of a squares poss values
            // entropy equals value*numSquaresPossible + value*numSquaresPossible
            // lowest entropy is best. entropy sorts by both at same time!
        let emptyKey = emptyKeys.sort((squareA, squareB) => {
            return currentSquares[squareA].possVals.length - currentSquares[squareB].possVals.length
        })[0]
  
        //while the currentsquare has possible values left
        while (currentSquares[emptyKey].possVals.length > 0) {
            // console.log(`Solving for ${emptyKey}`);
            // console.log(`${emptyKey}: ${currentSquares[emptyKey].possVals}`);
            let alteredSquares = [];
            
            //get the first value to try (removing it from this and all deeper possval lists)
            let tryVal = currentSquares[emptyKey].possVals.shift();
            // console.log(`Trying ${tryVal}`);

            //put the tried value into the currentSquares
            currentSquares[emptyKey].value = tryVal;

            //remove the tried value from the empty neighbors' possVals
            currentSquares[emptyKey].neighbors.filter(neighbor => !currentSquares[neighbor].value)
            .forEach(emptyNeighbor => {
                //remove the imput value
                let index = currentSquares[emptyNeighbor].possVals.indexOf(tryVal);
                if (index !==-1) {
                    currentSquares[emptyNeighbor].possVals.splice(index, 1);
                }
            })

            //if there are any squares with only one possible value, set that value and remove from neighbors
            //repeat the process until there are no squares with one value
            while(Object.keys(currentSquares).some(square => !currentSquares[square].value && currentSquares[square].possVals.length ===1)) {
                let solvableSquare = Object.keys(currentSquares).find(square => !currentSquares[square].value && currentSquares[square].possVals.length === 1 )
                let value = currentSquares[solvableSquare].possVals[0];
                // console.log(`Found ${solvableSquare} with only possible value ${value}`);
                currentSquares[solvableSquare].value = value;
                alteredSquares.push(solvableSquare);
                currentSquares[solvableSquare].neighbors.filter(neighbor => !currentSquares[neighbor].value)
                .forEach(emptyNeighbor => {
                    let index = currentSquares[emptyNeighbor].possVals.indexOf(value);
                    if (index !== -1) {
                        currentSquares[emptyNeighbor].possVals.splice(index,1);
                    }
                })
            }

            //if all empty squares have possible values, the puzzle is solvable and we should go deeper.
            if (!Object.keys(currentSquares).filter(square => !currentSquares[square].value)
            .some(emptySquare => currentSquares[emptySquare].possVals.length ===0)) {
                // console.log("Those all worked. Let's go deeper.");
                let result = findSolution(currentSquares);
                
                if (result) {//if it returned the object, it is our solved object. Send it up.
                    if (result) {
                        return result;
                    }
                }
            }
            //if this code is running, we didn't get a positive result and return it
            //something with the current configuration is wrong
            // console.log('Found squares with no possible values');
            //if there are more values to be checked for this square
            //reset current empty square
            currentSquares[emptyKey].value = '';
            //reset the squares that were changed
            alteredSquares.forEach(square => {
                currentSquares[square].value = '';
                // console.log(`Resetting ${square}`);
            });
            //reset possVals for all empty squares except the one currently being tested
            emptyKeys.forEach(emptySquare => {
                if (emptyKey === emptySquare) {
                    return;
                }
                let possVals = [1,2,3,4,5,6,7,8,9];
                let neighbors = currentSquares[emptySquare].neighbors;
                neighbors.forEach(neighbor => {
                    let neighborVal = currentSquares[neighbor].value;
                    if (neighborVal && possVals.includes(neighborVal)) {
                        possVals = possVals.filter(num => num !== neighborVal)
                    }
                })
                currentSquares[emptySquare].possVals = possVals;
            });
            if (currentSquares[emptyKey].possVals.length > 0) {
                // console.log(`Trying next value for ${emptyKey}.`)
            } else {//there are no more values to be checked for this square
                //something prior to this was off. return false
                // console.log(`No more possible values for ${emptyKey}. Going back.`);
                console.count('badguess')

                return false;
            }
        }
        console.count('badguess')
        return false;
    }
    
    if (solvable) {
        let result = findSolution(squares)//solvedsquares, isSolved, isSolvable
        if (!result) {
            // console.log('unsolvable');
            return false;
        } else {
            //return only the values
            let solution = {}
            Object.keys(result).forEach(square => {
                solution[square] = result[square].value;
            });
            return solution;
        }
    } else {
        // console.log('unsolvable');
        return false;
    }
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