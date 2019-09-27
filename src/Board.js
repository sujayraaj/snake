import React from 'react'

function Board({state = [], height, width, resolution}) {
    let h = height / resolution
    let w = width / resolution
    let multiplier = 50
    return <div style={{
        width: (width*multiplier) + 'px',
        height: (height*multiplier) + 'px',
        display:'flex',
        flexWrap: 'wrap'
    }} >
        {state.map((val={}) => <div style={{
            width: (w*multiplier) + 'px',
            height: (h*multiplier) + 'px',
        }} className={[val.type,'cell'].join(' ')} value={val.value} ></div>)}
    </div>
}

export default Board