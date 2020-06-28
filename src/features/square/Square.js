import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSquare } from './squareSlice';
import { neighborsOf } from './helper';

export const Square = props => {
    let dispatch = useDispatch()
    let square = String(props.row) + String(props.col);

    let value = useSelector(state => state.square.board[square]);
    let possible = useSelector(state => {
        let poss = [false, true, true, true, true, true, true, true, true, true];
        neighborsOf(square).forEach(neighbor => {
            let neighborVal = state.square.board[neighbor];
            if (neighborVal) {
                poss[neighborVal] = false;
            }
        });
        return poss;
    }
    )

    // useEffect(() => {
    //     //sets the last possible value if theres only one; dangerous running simultaneous with others
    //     // if (possible.filter(a => a).length === 1 && !value) {
    //     //     dispatch(setSquare({
        //     //         square,
        //     //         value: possible.findIndex(a => a)
        //     //     }))
        //     // }
        // })
        
        //let squares = useSelector(state => state.square);
    const handleChange = e => {
        dispatch(setSquare({square: square, value: Number(e.target.value) || e.target.className[0]}));
    }

    const PossGrid = props => {
        let tinies = [];
        for (let i = 0; i < 3; i++) {
            let babies = [];
            for (let j=0; j<3; j++) {
                let num = i*3 + 1 + j;
                babies.push(<td key={j}
                    className={String(num) + ' tiny ' + (possible[num] ? 'green' : 'red')}
                    onClick={handleChange}
                    >{num}</td>)
            }
            tinies.push(<tr key={i}>{babies}</tr>);
        }
        


        return (
            <table className="poss-grid">
                <tbody>
                    {tinies}
                </tbody>
            </table>
        );
    }
    

    //make the square red if it is erroneous? using fitsWithNeighbors?
    return (
        <div className={"square" + (true ? '': '')}>
            <input type="number" min="1" max="9" value={value} onChange={handleChange}/>
            <PossGrid/>
        </div>
    )
}