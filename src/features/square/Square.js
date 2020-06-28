import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSquare, highlightNeighbors } from './squareSlice';
import { neighborsOf } from './helper';


export const Square = props => {
    const dispatch = useDispatch()
    const square = String(props.row) + String(props.col);
    const neighbors = neighborsOf(square)
    const value = useSelector(state => state.square.board[square]);
    const isActive = useSelector(state => state.square.active === square);
    const isHighlighted = useSelector(state => state.square.highlight.includes(square));

    if (isActive) {
        dispatch(highlightNeighbors({active: square, neighbors: neighbors}));
    }

    const handleChange = e => {
        if (Number(e.target.value)) {
            dispatch(setSquare({square: square, value: e.target.value}))
        }
    }

    const handleFocus = e => {
        dispatch(highlightNeighbors({active: square, neighbors: neighbors}));
    }

    const handleKeyDown = e => {
        //e.preventDefault();
        let keyCode = e.keyCode;
        //console.log(e.keyCode);   
        if (isActive) {
            if (keyCode > 48 && keyCode <= 57) {
                //dispatch(setSquare({square: square, value: keyCode-48}));
            } else if (keyCode === 8 || keyCode === 46 || keyCode===48 || keyCode ===96) {//backspace and delete and key0 and numpad0
                e.preventDefault();
                dispatch(setSquare({square: square, value: ''}));

            } else if (keyCode === 37 && square[1]>1) {//left
                let newSquare = square[0] + (Number(square[1]) - 1)
                document.getElementById(`${newSquare}input`).focus();

            } else if (keyCode === 39 && square[1]<9) {//right
                let newSquare = square[0] + (Number(square[1]) + 1);
                document.getElementById(`${newSquare}input`).focus();

            } else if (keyCode === 38 && square[0]>1) {//up
                let newSquare = (Number(square[0]) - 1) + square[1];
                document.getElementById(`${newSquare}input`).focus();
                
            } else if (keyCode === 40 && square[0]<9) {//down
                let newSquare = (Number(square[0]) + 1) + square[1];
                document.getElementById(`${newSquare}input`).focus();

            }
        }
    }

    const classes = 'square ' + (isActive ? 'active ' : '') + (isHighlighted ? 'highlight' : '');

    useEffect(() => {
        if (isActive) {
            document.getElementById(`${square}input`).focus()
            //ReactDOM.findDOMNode(this.refs[square]).focus()
        }
    }, [isActive, square])
    //make the square red if it is erroneous? using fitsWithNeighbors?
    return (
        <div >
            <input tabIndex={square}  className={classes} id={square+'input'}
            onChange={handleChange} value={value}
            onFocus={handleFocus} onClick={handleFocus} onKeyDown={handleKeyDown}/>
        </div>
    )
}