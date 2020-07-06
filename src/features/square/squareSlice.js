import { createSlice } from '@reduxjs/toolkit';

let initialState = {};
let presetBoard = [
    [4, , ,  , , ,   , , 2],
    [, 6, ,  4, , 8,   , 3, 1],
    [, , 1,  , , ,   6, , 4],

    [, 4, ,   1, , 7,   , 5, ],
    [1, , ,   , 8, ,   4, , ],
    [, 5, ,   3, , 4,   , 1, ],

    [6, 7, 9,   8, 4, 3,   1, 2, 5],
    [, 1, ,   6, , 2,   , 4, ],
    [2, 3, 4,   , , ,   , 6, 8]
];
// let presetBoard = [
//     [4, , ,  , , ,   , , 2],
//     [, 6, ,  4, , 8,   , 3, ],
//     [, , 1,  , , ,   6, , ],

//     [, 4, ,   1, , 7,   , 5, ],
//     [, , ,   , 8, ,   , , ],
//     [, 5, ,   3, , 4,   , 1, ],

//     [, , 9,   , , ,   1, , ],
//     [, 1, ,   6, , 2,   , 4, ],
//     [2, , ,   , , ,   , , 8]
// ];

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        let row = i + 1;
        let col = j + 1;
        initialState[String(row)+String(col)] = presetBoard[i][j] || '';
    }
}



export const squareSlice = createSlice({
    name: 'square',
    initialState: {
        board: initialState,
        highlight: [],
        active: '55',
        isSolvable: true
    },
    reducers: {
        setSquare: (state, action) => {
            // console.log(action.payload);
            let value;
            if (Number(action.payload.value)) {
                value = Number(action.payload.value)
            } else {
                value = ''
            }
            if (value > 9) {
                value = Number(String(value)[1])
            }
            state.board[action.payload.square] = value;
        },
        setSolution: (state, action) => {
            //console.log(action.payload);
            state.board = action.payload;
        },
        setSolvable: (state, action) => {
            state.isSolvable = action.payload;
        },
        resetPuzzle: (state) => {
            state.board = initialState;            
        },
        highlightNeighbors: (state, action) => {
            state.active = action.payload.active;
            state.highlight = action.payload.neighbors;
        }
    }
})

export const { setSquare, setSolution, setSolvable, resetPuzzle, highlightNeighbors } = squareSlice.actions;

export default squareSlice.reducer;