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
        border: "2px solid #F72585",
        borderRadius: '20%',
        background: this.props.background,

      }
    }
  }

  componentDidMount() {
    window.addEventListener("keyup", (e) => this.buttonListener(e))
  }
  componentWillUnmount() {
    window.removeEventListener("keyup", (e) => this.buttonListener(e))
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
    const { apple, snake, apple2 } = this.props.state;
    const head = snake[snake.length - 1]
    const wallsCheck = callback(head.x, head.y, this.props.areaSizeInBlocks);
    if ((apple.x === head.x && apple.y === head.y) || (apple2.x === head.x && apple2.y === head.y)) {
      debugger
      this.props.stateUpdater("SNAKE_EAT")
    }
    const selfCollision = this.props.state.snake.find((el, i, arr) => {
      if (i < arr.length - 1) {
        if (el.x === head.x && el.y === head.y) return el;
      }
    });
    if (selfCollision) {
      this.props.stateUpdater("SELF_COLLISION");
  
    }
    else if (wallsCheck) {
      snake[snake.length - 1] = {
        ...wallsCheck,
        pic: snake[snake.length - 1].pic
      };
      this.props.stateUpdater("SNAKE", [...snake]);
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


  buttonListener = (e) => {
    const buttonChek = this.buttonChecker(e.keyCode)
    const check =
      (buttonChek === "w" && this.props.prevKey !== "s") ||
      (buttonChek === "a" && this.props.prevKey !== "d") ||
      (buttonChek === "s" && this.props.prevKey !== "w") ||
      (buttonChek === "d" && this.props.prevKey !== "a")
    if (check) {
      this.props.stateUpdater("SNAKE", buttonChek)
    }
  }

  buttonChecker = (keycode) => {
    switch (keycode) {
      case 38:
      case 87:
        return 'w'
      case 37:
      case 65:
        return 'a'
      case 40:
      case 83:
        return 's'
      case 39:
      case 68:
        return 'd'

    }
  }


  snakeMapping = (segments, blockSize) => {
    return segments.map((el, i) => {
      const styles = {
        top: `${el.y * blockSize}px`,
        left: `${el.x * blockSize}px`,
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
          segments={segments}
        />
      </>
    )
  }
}
