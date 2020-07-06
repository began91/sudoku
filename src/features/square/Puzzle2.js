import { neighborsOf, neighborsOfBoth, boxOfSquare, allSquares, squaresIn, RCBV } from './helper';
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

    isEmpty(square) {
        return !this[square].value
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

    findNakedSingle() {
        return this.emptySquares().find(square => this[square].possVals.length === 1);
    }
    
    emptiesIn(type, RCB) {
        return squaresIn(type, RCB).filter(this.isEmpty.bind(this));
    }
    
    countValueIn(value, type, RCB) {
        let count = 0;
        this.emptiesIn(type, RCB).forEach(square => {
            count += this[square].possVals.includes(value) ? 1 : 0;
        })
        return count;
    }
    
    nakedSingles() {
        let changesMade = false;
        let nakedSingle = this.findNakedSingle();
        while (nakedSingle && this.allEmptySquaresHavePossVals()) {
            let newVal = this[nakedSingle].possVals[0];
            console.log(`Naked Single: ${nakedSingle} has only available value ${newVal}`)
            this[nakedSingle].value = newVal;
            changesMade = true;
            this.removeValueFromNeighbors(nakedSingle, newVal);
            nakedSingle = this.findNakedSingle();
        }
        return changesMade;
    }

    hiddenSingles() {
        //count instances of each poss variable in the row
        let changesMade = false;
        RCBV().forEach(value => {//one value at a time
            RCBV().forEach(RCB => {
                ['row','col','box'].forEach(type => {
                    if (this.countValueIn(value, type, RCB) === 1) {//scan RCB type 
                        this.emptiesIn(type, RCB)
                        .filter(square => this[square].possVals.includes(value))
                        .forEach(square => {
                            this[square].value = value;
                            changesMade = true;
                            this.removeValueFromNeighbors(square, value);
                            console.log(`Hidden Single: ${square} is only ${value} in ${type} ${RCB}`);
                        })
                    } 
                })
            })
        })
        return changesMade;
    }

    lockedCandidates() {
        let changesMade = false
        RCBV().forEach(RCB => {
            RCBV().forEach(value => {
                //row / col
                ['row','col'].forEach(type => {//if all values in a row/col
                    let squaresWithVal = this.emptiesIn(type, RCB)
                    .filter(square => this[square].possVals.includes(value))//that include the value
                    if(squaresWithVal.length > 0 && squaresWithVal
                    .map(square => this[square].box)
                    .every((box, i, arr) => box === arr[0])) {//are in the same box
                        //remove that value from elsewhere
                        this.emptiesIn('box', boxOfSquare(squaresWithVal[0]))
                        .filter(square => !squaresWithVal.includes(square))
                        .forEach(square => {
                            if (this.removePossValFromSquare(square, value)) {
                                changesMade = true;
                                console.log(`Locked Candidate (${type}): Removing ${value} from ${square} due to locked candidate in ${squaresWithVal} `);
                            }
                        })
                    }
                    //box
                    squaresWithVal = this.emptiesIn('box', RCB)//for values in box
                    .filter(square => this[square].possVals.includes(value));//containing the value

                    let letterChoice = type === 'row' ? 0 : 1;

                    if (squaresWithVal.length > 0 && squaresWithVal//if they exist
                    .map(square => square[letterChoice])//and their row/col
                    .every((RC, i, arr ) => RC === arr[0])) {//are all the same
                        this.emptiesIn(type, squaresWithVal[0][letterChoice])
                        .filter(square => !squaresWithVal.includes(square))
                        .forEach(square => {
                            if (this.removePossValFromSquare(square, value)) {
                                changesMade = true;
                                console.log(`Locked Candidate (box): Removing ${value} from ${square} due to locked candidate in ${squaresWithVal} `);
                            }
                        })
                    }
                })
            })
        })
        return changesMade;
    }
    
    nakedPairs() {
        //if a square has a neighbor that has the same two, and only two possVals
        //those two vals cannot be in any of their shared neighbors
        let changesMade = false;
        this.emptySquares()
        .filter(square => this[square].possVals.length === 2)
        .forEach(square => {
            let possVals = this[square].possVals;
            neighborsOf(square)
            .filter(this.isEmpty.bind(this))
            .filter(neighbor => this[neighbor].possVals === possVals)
            .forEach(neighbor => {
                neighborsOfBoth(square, neighbor)
                .filter(this.isEmpty.bind(this))
                .forEach(otherNeighbor => {
                    possVals.forEach(value => {
                        if (this.removePossValFromSquare(otherNeighbor, value)) {
                            changesMade = true;
                            console.log(`Naked Pairs: Removing ${value} from ${otherNeighbor} due to naked pair ${possVals} in ${square} & ${neighbor}`);
                        }
                    })
                })
            })      
        })
        return changesMade;
    }

    hiddenPairs() {
        let changesMade = false;
        //if a row has two possvals that are only in the two squares, no other values can exist in those two squares.
        this.emptySquares().forEach(square => {
            ['row','col','box'].forEach(type => {
                let possVals = this[square].possVals;
                possVals.forEach(value => {
                    let neighborsWithMatch = this.emptiesIn(type, this[square][type])
                    .filter(neighbor => this[neighbor].possVals.includes(value));

                    if (neighborsWithMatch.length === 1) {
                        possVals.filter(otherValue => value !== otherValue)
                        .filter(otherValue => this[neighborsWithMatch[0]].possVals.includes(otherValue))//the second value is included in the potential match
                        .filter(otherValue => {
                            return this.emptiesIn(type, this[square][type])
                            .filter(otherNeighbor => otherNeighbor!==square && otherNeighbor !== neighborsWithMatch[0])//othersquares in RCB
                            .every(otherNeighbor => !this[otherNeighbor].possVals.includes(otherValue))//do not include second value
                        }).forEach(otherValue => {
                            [square, neighborsWithMatch[0]].forEach((hiddenPair, i, arr) => {
                                this[hiddenPair].possVals.filter(val => val !== value && val !== otherValue)
                                .forEach(removeVal => {
                                    console.log(`Removing ${removeVal} from ${hiddenPair} due to hidden pair ${arr} with values ${value} & ${otherValue}`);
                                    this.removePossValFromSquare(square, removeVal);
                                    changesMade = true;
                                })
                            })
                        })
                        
                    }
                })
            })
        })
        return changesMade;
    }

    xwing() {
        let changesMade = false;
        // ['row','col'].forEach(type => {
        //     RCBV().forEach(value => {
        //         //RCwithTwoOfValue
        //         RCBV().filter(RC => {//rows with two instances of value
        //             return this.emptiesIn(type, RC)
        //             .filter(square => this[square].possVals.includes(value)).length ===2;
        //         }).filter(RC => {//where the value is in matching columns as the first 

        //         })
        //     })
        // })
        return changesMade;
    }

    solve() {
        if (this.solved) {
            return true;
        } else if (!this.solvable) {
            return false;
        }
        
        if ([
            'nakedSingles',
            'hiddenSingles',
            'lockedCandidates',
            'nakedPairs',
            'hiddenPairs', //RCB
            'xWing' //RC
        ].some(fn => this[fn]())) {
            this.solve()
        } else {
            if(this.emptySquares().length ===0) {
                console.log('Solved!')
            }
            if(!this.allEmptySquaresHavePossVals()) {
                console.log('Unsolvable')
            }
            console.log('Cannot solve further');
            return false;
        }
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
