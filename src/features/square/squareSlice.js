import { createSlice } from '@reduxjs/toolkit';

let initialState = {};

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        let row = (Math.floor(i/3)*3 + 1) + Math.floor(j/3);
        let col = (((i % 3) * 3) + 1) + (j % 3)
        initialState[String(row)+String(col)] = ''
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