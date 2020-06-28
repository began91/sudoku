import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
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
        dispatch(setSquare({square: square, value: Number(e.target.value) || e.target.className[0]}));
    }

    const handleFocus = e => {
        dispatch(highlightNeighbors({active: square, neighbors: neighbors}));
    }

    const handleKeyPress = e => {
        let keyCode = e.keyCode;
        console.log(keyCode);
        if (isActive) {
            if (keyCode > 48 && keyCode <= 57) {
                dispatch(setSquare({square: square, value: keyCode-48}));
            }
        }
    }

    const classes = 'square ' + (isActive ? 'active ' : '') + (isHighlighted ? 'highlight' : '');

    // useEffect(() => {
    //     if (isActive) {
    //         ReactDOM.findDOMNode(this.refs[square]).focus()
    //     }
    // })
    //make the square red if it is erroneous? using fitsWithNeighbors?
    return (
        <div className={classes}>
            <div className={value + "input"} onChange={handleChange}
            onFocus={handleFocus} onClick={handleFocus} onKeyPress={handleKeyPress}>{value}</div>
        </div>
    )
}