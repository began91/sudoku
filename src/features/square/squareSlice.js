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
        //solution: {},
        isSolvable: true
    },
    reducers: {
        setSquare: (state, action) => {
            // console.log(action.payload);
            state.board[action.payload.square] = Number(action.payload.value);
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
        }
        
    }
})

export const { setSquare, setSolution, setSolvable, resetPuzzle } = squareSlice.actions;

export default squareSlice.reducer;