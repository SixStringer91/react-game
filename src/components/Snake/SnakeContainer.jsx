import React from 'react';
import './Snake.css'
import Snake from './Snake'

export default class SnakeContainer extends React.Component {

  componentDidUpdate() {
    this.buttonListener();
    this.setCollisions(this.wallsChecker)
  }

  setCollisions = (callback) => {
    const snake = [...this.props.state.snake];
    const { apple } = this.props.state;
    const { x, y } = snake[snake.length - 1];
    const wallsCheck = callback(x, y, this.props.areaSizeInBlocks);
    const selfCollision = this.props.state.snake.find((el, i, arr) => {
      if (i < arr.length - 1) {
        if (el.x === x && el.y === y) return el;
      }
    });
    if (selfCollision) {
      this.props.stateUpdater('game-loop')
    }
    else if (wallsCheck) {
      snake[snake.length - 1] = {
        ...wallsCheck,
        pic: snake[snake.length - 1].pic
      };
      this.props.stateUpdater('snake', [...snake]);
    }
  }

  wallsChecker = (x, y, areaSizeInBlocks) => {
    let nextX = x;
    let nextY = y;
    if (y > areaSizeInBlocks - 1) nextY = 0;
    else if (y < 0) nextY = areaSizeInBlocks - 1;
    else if (x > areaSizeInBlocks - 1) nextX = 0;
    else if (x < 0) nextX = areaSizeInBlocks - 1;
    return nextX !== x || nextY !== y
      ? { x: nextX, y: nextY, pic: [1, 4] }
      : null;
  };


  buttonListener = () => {
    window.addEventListener("keyup", (e) => {
      const buttonChek =
        (e.key === "w" && this.props.prevKey !== "s") ||
        (e.key === "a" && this.props.prevKey !== "d") ||
        (e.key === "s" && this.props.prevKey !== "w") ||
        (e.key === "d" && this.props.prevKey !== "a") ||
        e.key === " ";
      if (buttonChek) {
        this.props.buttonListener(e.key)
      }
    });
  }

  render() {

    const { snake } = this.props.state;


    return (
      <>
        <Snake
          style={{ width: `${this.props.blockSize}px`, heigth: `${this.props.blockSize}px` }}
          blockSize={this.props.blockSize}
          segments={snake}
        />
      </>
    )
  }
}
