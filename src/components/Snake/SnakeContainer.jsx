import React from 'react';
import './Snake.css'
import Snake from './Snake'

export default class SnakeContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultStyles: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: `${this.props.blockSize}px`,
        height: `${this.props.blockSize}px`,
        zIndex: '2',
        backgroundSize: `${this.props.blockSize * 5}px ${this.props.blockSize * 4}px`
      }
    }
  }

  componentDidMount() {
    this.buttonListener();
  }

  componentDidUpdate(preProps) {
    this.setCollisions(this.wallsChecker);
    if (preProps.blockSize !== this.props.blockSize) {
      this.setState({
        defaultStyles: {
          ...this.state.defaultStyles, width: `${this.props.blockSize}px`,
          height: `${this.props.blockSize}px`, backgroundSize: `${this.props.blockSize * 5}px ${this.props.blockSize * 4}px`
        }
      })
    }
  }

  setCollisions = (callback) => {
    const { apple, snake } = this.props.state;
    const head = snake[snake.length - 1]
    const wallsCheck = callback(head.x, head.y, this.props.areaSizeInBlocks);
    if (apple.x === head.x && apple.y === head.y) {
      this.props.stateUpdater('snakeEat')
    }
    const selfCollision = this.props.state.snake.find((el, i, arr) => {
      if (i < arr.length - 1) {
        if (el.x === head.x && el.y === head.y) return el;
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

  snakeMapping = (segments, blockSize) => {
    return segments.map((el, i) => {
      const styles = {
        top: `${el.y * blockSize}px`,
        left: `${el.x * blockSize}px`,
        backgroundPosition: `${blockSize * el.pic[0]}px ${blockSize * el.pic[1]}px`

      }
      return <div className={`snake`} key={i} style={{ ...this.state.defaultStyles, ...styles }} />
    })
  }

  render() {

    const { state: { snake }, blockSize } = this.props;
    const segments = this.snakeMapping(snake, blockSize)
    return (
      <>
        <Snake
          style={{ width: `${blockSize}px`, heigth: `${blockSize}px` }}
          segments={segments}
        />
      </>
    )
  }
}
