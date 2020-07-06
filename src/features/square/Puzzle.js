import { neighborsOf, boxOfSquare, allSquares, squaresInRow, squaresInCol, squaresInBox, rows, values, cols } from './helper';
// let puzzle = new Puzzle(squares);

class Puzzle {
    constructor(squares) {
        this.solvable = true;
        this.solved = false;
        if (!squares) {
            squares = {};
            allSquares().forEach(square => squares[square] = '');
        }
        Object.entries(squares).forEach(([square,value]) => {
            this[square] = {
                value,
                possVals: [],
                neighbors: neighborsOf(square),
                row: square[0],
                col: square[1],
                box: boxOfSquare(square)
            }
        });

        this.populateAllPossVals();
        if (!this.allEmptySquaresHavePossVals()) {
            this.solvable = false;
        }
    }

    populateAllPossVals() {
        allSquares().forEach(square => {
            this.populatePossVals(square);
        })
    }

    populatePossVals(square) {
        let possVals = [1,2,3,4,5,6,7,8,9];
        this[square].neighbors.forEach(neighbor => {
            let neighborVal = this[neighbor].value;
            if (neighborVal && possVals.includes(neighborVal)) {
                possVals = possVals.filter(num => num !== neighborVal);
            }
        })
        this[square].possVals = possVals;
    }

    emptySquares() {
        return allSquares().filter(this.isEmpty.bind(this));
    }

    singleSquareWithOnePossVal() {
        return this.emptySquares().find(square => this[square].possVals.length === 1);
    }

    allEmptySquaresHavePossVals() {
        return this.emptySquares().every(square => this[square].possVals.length !==0);
    }

    removePossValFromSquare(square, value) {
        let index = this[square].possVals.indexOf(value);
        if (index !== -1) {
            this[square].possVals.splice(index, 1);
            return true; //return true if a value is actually removed
        }
        return false; //nothin in possvals to remove
    }

    removeValueFromNeighbors(square, value) {
        this[square].neighbors.forEach(neighbor => {
            this.removePossValFromSquare(neighbor, value);
        });
    }

    setSquaresWithOnePossVal() {
        let square = this.singleSquareWithOnePossVal()
        let changesMade = false;
        while (square && this.allEmptySquaresHavePossVals()) {
            let newVal = this[square].possVals[0];
            console.log(`${square} has only available value ${newVal}`)
            this[square].value = newVal;
            changesMade = true;
            this.removeValueFromNeighbors(square, newVal);
            square = this.singleSquareWithOnePossVal();
        }
        return changesMade;
    }

    isEmpty(square) {
        return !this[square].value
    }

    setOnlyPossValInRCB() {
        //all at same time based on square
        let changesMade = false;
        do {
            changesMade = false;
            this.emptySquares().forEach(square => {
                let row = square[0];
                let col = square[1];
                let box = boxOfSquare(square);
                let possVals = this[square].possVals;
                //for each possible value in the square, if it doesnt exist elsewhere in its row, col, and box, it is the only possible value for that square.
                possVals.forEach(value => {
                    //if the value doesnt exist in the empty boxes' possvals in the row col and box set the value
                    if (
                        squaresInRow(row)
                        .filter(this.isEmpty.bind(this))
                        .filter(otherSquare => otherSquare!==square)
                        .every(otherSquare => !this[otherSquare].possVals.includes(value)) 
                        ||
                        squaresInCol(col)
                        .filter(this.isEmpty.bind(this))
                        .filter(otherSquare => otherSquare !== square)
                        .every(otherSquare => !this[otherSquare].possVals.includes(value))
                        ||
                        squaresInBox(box)
                        .filter(this.isEmpty.bind(this))
                        .filter(otherSquare => otherSquare !== square)
                        .every(otherSquare => !this[otherSquare].possVals.includes(value)) 
                    ) {
                        this[square].value = value;
                        console.log(`${value} is only available in ${square}`)
                        this.removeValueFromNeighbors(square,value);
                        this.setSquaresWithOnePossVal();
                        changesMade = true;
                    }

                    //if all the possVal matches in the box are in the same row and box, remove it from the rest of the row
                    let squaresWithMatchingPossValInBox = squaresInBox(box)
                    .filter(this.isEmpty.bind(this))
                    .filter(otherSquare => otherSquare !== square)
                    .filter(otherSquare => this[otherSquare].possVals.includes(value));

                    if (squaresWithMatchingPossValInBox.every(otherSquare => otherSquare[0] === row)) { //if every square is in the same row
                        //remove that possval from the rest of the row
                        squaresInRow(row)
                        .filter(this.isEmpty.bind(this))
                        .filter(thirdSquare => this[thirdSquare].box !== box)
                        .forEach(thirdSquare => {
                            let result = this.removePossValFromSquare(thirdSquare, value);
                            if (result) {
                                changesMade = true;
                                console.log(`Removing ${value} from ${thirdSquare} because of ${squaresWithMatchingPossValInBox} & ${square}`);
                            }
                        })
                    }

                    if (squaresWithMatchingPossValInBox.every(otherSquare => otherSquare[1] === col)) { //if every square is in the same col
                        //remove that possval from the rest of the col
                        squaresInCol(col)
                        .filter(this.isEmpty.bind(this))
                        .filter(thirdSquare => this[thirdSquare].box !== box)
                        .forEach(thirdSquare => {
                            let result = this.removePossValFromSquare(thirdSquare, value);
                            if (result) {
                                changesMade = true;
                                console.log(`Removing ${value} from ${thirdSquare} because of ${squaresWithMatchingPossValInBox} & ${square}`);
                            }
                        })
                    }

                    let squaresWithMatchingPossValInRow = squaresInRow(row)
                    .filter(this.isEmpty.bind(this))
                    .filter(otherSquare => otherSquare !== square)
                    .filter(otherSquare => this[otherSquare].possVals.includes(value));

                    if (squaresWithMatchingPossValInRow.every(otherSquare => this[otherSquare].box === box)) {
                        squaresInBox(box)
                        .filter(this.isEmpty.bind(this))
                        .filter(thirdSquare => this[thirdSquare].box !== box)
                        .forEach(thirdSquare => {
                            let result = this.removePossValFromSquare(thirdSquare, value);
                            if (result) {
                                changesMade = true;
                                console.log(`Removing ${value} from ${thirdSquare} because of ${squaresWithMatchingPossValInRow} & ${square}`);
                            }
                        })
                    }
                    
                    let squaresWithMatchingPossValInCol = squaresInCol(col)
                    .filter(this.isEmpty.bind(this))
                    .filter(otherSquare => otherSquare !== square)
                    .filter(otherSquare => this[otherSquare].possVals.includes(value));
                    
                    if (squaresWithMatchingPossValInCol.every(otherSquare => this[otherSquare].box === box)) {
                        squaresInBox(box)
                        .filter(this.isEmpty.bind(this))
                        .filter(thirdSquare => this[thirdSquare].box !== box)
                        .forEach(thirdSquare => {
                            let result = this.removePossValFromSquare(thirdSquare, value);
                            if (result) {
                                changesMade = true;
                                console.log(`Removing ${value} from ${thirdSquare} because of ${squaresWithMatchingPossValInCol} & ${square}`);
                            }
                        })
                    }
                    

                    if (squaresWithMatchingPossValInBox.length === 1) {
                        //hidden pairs
                        possVals.filter(otherValue => value !== otherValue)//and one of the other possvalues in square
                        .forEach(otherValue => {
                            let squaresMatchingOther = squaresInBox(box)//is also included in a different empty square in that column
                            .filter(this.isEmpty.bind(this))
                            .filter(otherSquare => otherSquare !== square)
                            .filter(otherSquare => this[otherSquare].possVals.includes(otherValue));
    
                            if (squaresMatchingOther.length === 1 && squaresMatchingOther[0] === squaresWithMatchingPossValInCol[0]) {
                                // console.log(`${square} & ${squaresMatchingOther[0]} have hidden pair ${value} & ${otherValue}`);
                                possVals.filter(val => val !== value && val !== otherValue)
                                .forEach(removeVal => {
                                    console.log(`Removing ${removeVal} from ${square} due to hidden pair with ${squaresMatchingOther[0]} of ${value} & ${otherValue}`);
                                    this.removePossValFromSquare(square, removeVal);
                                    changesMade = true;
                                });
                                this[squaresMatchingOther[0]].possVals.filter(val => val !== value && val !== otherValue)
                                .forEach(removeVal => {
                                    console.log(`Removing ${removeVal} from ${square} due to hidden pair with ${squaresMatchingOther[0]} of ${value} & ${otherValue}`);
                                    this.removePossValFromSquare(squaresMatchingOther[0], removeVal);
                                    changesMade = true;
                                });
                            }
                        })
                    }



                    //x-wing row
                    //if there is only one other instance of value in row
                    //if those instances are also found in the same columns of another row
                    //and there are no other instances in that row
                    //then that value can be removed from each of those columns.
                    if (squaresWithMatchingPossValInRow.length === 1) {// if there is only one other instance in a row

                        //hidden pairs; not x-wing
                        possVals.filter(otherValue => value !== otherValue)//and one of the other possvalues in square
                        .forEach(otherValue => {
                            let squaresMatchingOther = squaresInRow(row)//is also included in a different empty square in that column
                            .filter(this.isEmpty.bind(this))
                            .filter(otherSquare => otherSquare !== square)
                            .filter(otherSquare => this[otherSquare].possVals.includes(otherValue));

                            if (squaresMatchingOther.length === 1 && squaresMatchingOther[0] === squaresWithMatchingPossValInCol[0]) {
                                // console.log(`${square} & ${squaresMatchingOther[0]} have hidden pair ${value} & ${otherValue}`);
                                possVals.filter(val => val !== value && val !== otherValue)
                                .forEach(removeVal => {
                                    console.log(`Removing ${removeVal} from ${square} due to hidden pair with ${squaresMatchingOther[0]} of ${value} & ${otherValue}`);
                                    this.removePossValFromSquare(square, removeVal);
                                    changesMade = true;
                                });
                                this[squaresMatchingOther[0]].possVals.filter(val => val !== value && val !== otherValue)
                                .forEach(removeVal => {
                                    console.log(`Removing ${removeVal} from ${square} due to hidden pair with ${squaresMatchingOther[0]} of ${value} & ${otherValue}`);
                                    this.removePossValFromSquare(squaresMatchingOther[0], removeVal);
                                    changesMade = true;
                                });
                            }
                        })
                        let rowMatch = squaresWithMatchingPossValInRow[0];//that instance
                        // //swordfish
                        // let swords = squaresWithMatchingPossValInCol.filter(colMatch => {
                        //     return squaresInRow(colMatch[0]).filter(this.isEmpty.bind(this))
                        //     .filter(squareInSecondRow => squareInSecondRow !== colMatch)
                        //     .filter(squareInSecondRow => this[squareInSecondRow].possVals.includes(value))
                        //     .length === 1;
                        // });

                        // if ()
                        // let swordSquares = [square]




                        let colMatch = squaresWithMatchingPossValInCol.find(colMatch => {//check other instances in that column
                            return squaresInRow(colMatch[0])//that have a row
                            .filter(this.isEmpty.bind(this))//of empty squares
                            .filter(squareInSecondRow => squareInSecondRow !== colMatch)//that are not the column's instance
                            .filter(squareInSecondRow => this[squareInSecondRow].possVals.includes(value))//and include the value
                            .every(squareWithPossVal => squareWithPossVal[1] === rowMatch[1])
                        })
                        if (colMatch) {//every matching column has in the same column as the matching row of the original square
                            squaresInCol(square[1]).filter(this.isEmpty.bind(this))//the empty squares in that column
                            .filter(colSquare => colSquare[0] !== square[0] && colSquare[0] !== colMatch[0])//that are not in the original row or colmatch row
                            .forEach(colSquare => {
                                let result = this.removePossValFromSquare(colSquare, value); //remove the value
                                if (result) {
                                    changesMade = true;
                                    console.log(`Removing ${value} from ${colSquare} because of X-wing row ${square}, ${colMatch}, ${rowMatch}, ${colMatch[0]}${rowMatch[1]}`);
                                }
                            });
                            squaresInCol(rowMatch[1]).filter(this.isEmpty.bind(this))//the empty squares in that column
                            .filter(colSquare => colSquare[0] !== square[0] && colSquare[0] !== colMatch[0])//that are not in the original row or colmatch row
                            .forEach(colSquare => {
                                let result = this.removePossValFromSquare(colSquare, value);
                                if (result) {
                                    changesMade = true;
                                    console.log(`Removing ${value} from ${colSquare} because of X-wing row ${square}, ${colMatch}, ${rowMatch}, ${colMatch[0]}${rowMatch[1]}`);
                                }
                            });  
                        }
                    }
                    
                    
                    //x-wing col
                    //vice versa for columns
                    if (squaresWithMatchingPossValInCol.length === 1) {// if there is only one other instance in a col
                        
                        //hidden pairs; not x-wing
                        possVals.filter(otherValue => value !== otherValue)//and one of the other possvalues in square
                        .forEach(otherValue => {
                            let squaresMatchingOther = squaresInCol(col)//is also included in a different empty square in that column
                            .filter(this.isEmpty.bind(this))
                            .filter(otherSquare => otherSquare !== square)
                            .filter(otherSquare => this[otherSquare].possVals.includes(otherValue));

                            if (squaresMatchingOther.length === 1 && squaresMatchingOther[0] === squaresWithMatchingPossValInCol[0]) {
                                // console.log(`${square} & ${squaresMatchingOther[0]} have hidden pair ${value} & ${otherValue}`);
                                possVals.filter(val => val !== value && val !== otherValue)
                                .forEach(removeVal => {
                                    console.log(`Removing ${removeVal} from ${square} due to hidden pair with ${squaresMatchingOther[0]} of ${value} & ${otherValue}`);
                                    this.removePossValFromSquare(square, removeVal);
                                    changesMade = true;
                                });
                                this[squaresMatchingOther[0]].possVals.filter(val => val !== value && val !== otherValue)
                                .forEach(removeVal => {
                                    console.log(`Removing ${removeVal} from ${square} due to hidden pair with ${squaresMatchingOther[0]} of ${value} & ${otherValue}`);
                                    this.removePossValFromSquare(squaresMatchingOther[0], removeVal);
                                    changesMade = true;
                                });
                            }
                        })
                        
                        let colMatch = squaresWithMatchingPossValInCol[0];//that matching instance in the original column
                        let rowMatch = squaresWithMatchingPossValInRow.find(rowMatch => {//check other instances in that row
                            return squaresInCol(rowMatch[1])//that have a col
                            .filter(this.isEmpty.bind(this))//of empty squares
                            .filter(squareInSecondCol => squareInSecondCol !== rowMatch)//that are not the row's instance
                            .filter(squareInSecondCol => this[squareInSecondCol].possVals.includes(value))//and include the value
                            .every(squareWithPossVal => squareWithPossVal[0] === colMatch[0])//in the same row as the matching col of the original square
                        });
                        if (rowMatch) {
                            squaresInRow(square[0]).filter(this.isEmpty.bind(this))//the empty squares in that row
                            .filter(rowSquare => rowSquare[1] !== square[1] && rowSquare[1] !== rowMatch[1])//that are not in the original column or rowMatch col
                            .forEach(rowSquare => {
                                let result = this.removePossValFromSquare(rowSquare, value); //remove the value
                                if (result) {
                                    changesMade = true;
                                    console.log(`Removing ${value} from ${rowSquare} because of X-wing col ${square}, ${rowMatch}, ${colMatch}, ${colMatch[0]}${rowMatch[1]}`);
                                }
                            });
                            squaresInRow(colMatch[0]).filter(this.isEmpty.bind(this))//the empty squares in that row
                            .filter(rowSquare => rowSquare[1] !== square[1] && rowSquare[1] !== rowMatch[1])//that are not in the original column or rowMatch col
                            .forEach(rowSquare => {
                                let result = this.removePossValFromSquare(rowSquare, value); //remove the value
                                if (result) {
                                    changesMade = true;
                                    console.log(`Removing ${value} from ${rowSquare} because of X-wing col ${square}, ${rowMatch}, ${colMatch}, ${colMatch[0]}${rowMatch[1]}`);
                                }
                            }); 
                        }
                    }


                    possVals.filter(otherValue => value !== otherValue)
                    .forEach(otherValue => {
                        let squaresWithTwoMatches = squaresWithMatchingPossValInBox
                        .filter(otherSquares => this[otherSquares].possVals.includes(otherValue));
                        if (squaresWithTwoMatches.length === 1) {
                            
                        }
                    })
                    
                    //if a neighbor of the square has a matching value that is nowhere else in that RCB
                    //and they have another matching value that is nowhere else in that RCB
                    //then no other values are possible in those two squares/



                });

                //if this squares possvals are the same as another square in the same row, column, or box, they cant be anywhere else in that row column or box.
                if (possVals.length === 2) {//naked pairs
                    neighborsOf(square)
                    .filter(this.isEmpty.bind(this))
                    .filter(neighbor => (this[neighbor].possVals.includes(possVals[0]) && this[neighbor].possVals.includes(possVals[1])))
                    .filter(neighbor => this[neighbor].possVals.length === 2)
                    .forEach(neighbor => {

                        //if a neighbor contains both possvals and no other possvals, no other empties in their shared hood can have those possVals
                        neighborsOf(square)
                        .filter(this.isEmpty.bind(this))
                        .filter(otherNeighbor => neighborsOf(neighbor).includes(otherNeighbor))
                        //.filter(sharedNeighbor => (sharedNeighbor !== neighbor && sharedNeighbor !== square))
                        .forEach(sharedNeighbor => {
                            let result1 = this.removePossValFromSquare(sharedNeighbor, possVals[0]);
                            let result2 = this.removePossValFromSquare(sharedNeighbor, possVals[1]);
                            if (result1) {
                                changesMade = true;
                                console.log(`Removing ${possVals[0]} from ${sharedNeighbor} because of ${neighbor} & ${square} with ${possVals}`);
                            }
                            if (result2) {
                                changesMade = true;
                                console.log(`Removing ${possVals[1]} from ${sharedNeighbor} because of ${neighbor} & ${square} with ${possVals}`);
                            }
                        })
                    }) 
                }


                // naked triple
                //if a square shares a set of three with three other squares in RCB,
                //those values cannot exist elsewhere in the RCB



                //hidden triple

                //naked quad

                //hidden quad

                //xy wing
                //if square has two values 
                //and two neighbors with two values
                //and each neighbors values include one of the two original square values
                //and the neighbors' second value is the same for each neighbor
                //then the second value can be eliminated from the intersection of the two neighbors

                
            });
            //row swordfish
            values().forEach(value => {
                let pairs = rows().filter(row => {
                    let occurrencesInRow =  squaresInRow(row).filter(this.isEmpty.bind(this))
                    .filter(square => this[square].possVals.includes(value))
                    .length;
                    return occurrencesInRow === 2 || occurrencesInRow === 3;
                }).map(row => {
                    return squaresInRow(row).filter(this.isEmpty.bind(this))
                    .filter(square => this[square].possVals.includes(value));
                });
                pairs = pairs.filter(pair => {
                    return pair.every(square => {
                        // console.log(square);
                        return pairs.filter(otherPair => {
                            return !otherPair.includes(square)
                        })
                        .some(otherPair => {
                            // console.log(otherPair);
                            return otherPair.map(otherSquare => otherSquare[1])
                            .includes(square[1])
                        })
                    })
                });
                // console.log(pairs);
                if (pairs.length === 3) {
                    let columns = new Set();
                    let rows = new Set();
                    pairs.forEach(pair => {
                        pair.forEach(square => {
                            rows.add(square[0]);
                            columns.add(square[1]);
                        })
                    })
                    if (columns.size===3) {
                        columns.forEach(col => {
                            squaresInCol(col).filter(this.isEmpty.bind(this))
                            .filter(square => !rows.has(square[0]))
                            .forEach(square => {
                                let result = this.removePossValFromSquare(square, value);
                                if (result) {
                                    changesMade = true;
                                    console.log(`Removing ${value} from ${square} because of swordfish row ${pairs}`);
                                }
                            })
                        })
                    }
                }
                // console.log(pairs)
                pairs = cols().filter(col => {
                    let occurrencesInCol = squaresInCol(col).filter(this.isEmpty.bind(this))
                    .filter(square => this[square].possVals.includes(value))
                    .length;
                    return occurrencesInCol === 2 || occurrencesInCol ===3;
                }).map(col => {
                    return squaresInCol(col).filter(this.isEmpty.bind(this))
                    .filter(square => this[square].possVals.includes(value));
                });
                pairs = pairs.filter(pair => {
                    return pair.every(square => {
                        // console.log(square);
                        return pairs.filter(otherPair => {
                            return !otherPair.includes(square)
                        })
                        .some(otherPair => {
                            // console.log(otherPair);
                            return otherPair.map(otherSquare => otherSquare[0])
                            .includes(square[0])
                        })
                    })
                });
                if (pairs.length === 3) {
                    let columns = new Set();
                    let rows = new Set();
                    pairs.forEach(pair => {
                        pair.forEach(square => {
                            rows.add(square[0]);
                            columns.add(square[1]);
                        })
                    })
                    if (columns.size===3) {
                        columns.forEach(col => {
                            squaresInCol(col).filter(this.isEmpty.bind(this))
                            .filter(square => !rows.has(square[0]))
                            .forEach(square => {
                                let result = this.removePossValFromSquare(square, value);
                                if (result) {
                                    changesMade = true;
                                    console.log(`Removing ${value} from ${square} because of swordfish col${pairs}`);
                                }
                            })
                        })
                    }
                }
                // console.log(pairs)
            });

            if (this.setSquaresWithOnePossVal()) {
                changesMade = true;
            }
            if (this.emptySquares().length === 0) {
                this.solved = true;
                break;
            }
            console.log(changesMade ? 'Going again!' : 'No changes.')
        } while (changesMade && this.allEmptySquaresHavePossVals());
    }

    logBoard() {
        if (this.allEmptySquaresHavePossVals()) {
            let board = [[],[],[],//each inside list is a row
                        [],[],[],
                        [],[],[]];
            allSquares().forEach(square => {
                board[square[0]-1][square[1]-1]= this[square].value || this[square].possVals.reduce((current, accum) => {
                    return String(current) + String(accum);
                });
            });
            console.log(board);
        } else {
            console.log('Impossible!')
        }
        if (this.solved) {
            console.log('Solved!')
        }
    }

    solve() {
        if (this.solved) {
            return true;
        } else if (!this.solvable) {
            return false;
        }
        this.setSquaresWithOnePossVal();
        this.setOnlyPossValInRCB();
        this.logBoard();
    }


    getSolution() {
        if (this.solved) {
            return this.solution;
        } else if (this.solvable) {
            let result = this.solve();
            if (!result) {
                this.solvable = false;
                return false
            }
        }
    }
}

export default Puzzle;
