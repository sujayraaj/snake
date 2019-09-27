import React, { useState, Fragment } from 'react';
import Board from './Board'
import './App.css';
import GameState from './GameState'
const Game = new GameState({
  boardConfiguration: {
    width: 10,
    height: 10,
    resolution: 10
  },
  snake: {
    pos: [4, 4],
    length: 2
  },
  fruits: [{
    type: 'fruit1',
    x: 7,
    y:7,
    value: 1
  }],
  fruitTypes: [
    {
      type: 'fruit1',
      value:1
    },
    {
      type: 'fruit2',
      value: 2,
    },
    {
      type: 'fruit3',
      value: 3,
    }
  ],
  walls: [{x:1,y:1},{x:2,y:3},{x:9,y:9}, {x:1,y:9}] ,
  
  tickTimer: 1000
})

function App() {
  const [, reRender] = useState(0)
  Game.setRenderFunc(reRender)
  let width = Game.getWidth()
  let height = Game.getHeight()
  let resolution = Game.getResolution()
  let gameState = Game.getGameState()
  let gameOver = Game.isOver()
  return <Fragment><Board state={gameState} height={height} width={width} resolution={resolution} />
    <div>CurrentTick: {Game.getTick()}</div>
    <div>CurrentScore: {Game.getScore()}</div>
    {
      gameOver ? <div className="gameover">Game Over</div> : null
    }
  </Fragment>
}

export default App;
