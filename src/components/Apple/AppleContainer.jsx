import React from 'react';
import Apple from './Apple'
import './Apple.css'


export default class AppleContainer extends React.Component {
  componentDidMount() {
    this.props.stateUpdater('apple', this.appleNewDirection())
  }


  componentDidUpdate({state:{apple:prevApple}}) {
    const {apple,snake,cyberSnake} = this.props.state
    // if (apple.x === snake[snake.length-1].x&&apple.y === snake[snake.length-1].y) {
    //   this.isCollision(this.props.state.snake);
    // }
    //else 
    if (apple.x === cyberSnake[cyberSnake.length-1].x&&apple.y === cyberSnake[cyberSnake.length-1].y){
    this.isCollision(this.props.state.cyberSnake,prevApple);
  }
  }
  isCollision = (snake,prevApple) => {
    const {apple} = this.props.state;
    const { x, y } = snake[snake.length - 1];
    if (y === apple.y && x === apple.x) {
      this.props.stateUpdater('apple', this.appleNewDirection(),prevApple)
    }

  }
  appleNewDirection = () => {
    const { state: { snake, cyberSnake}, areaSizeInBlocks } = this.props;
    let checkBody = true;
    while (checkBody) {
      const x = Math.floor(Math.random() * (areaSizeInBlocks - 1));
      const y = Math.floor(Math.random() * (areaSizeInBlocks - 1));
      if (!snake.find((obj) => obj.x === x && obj.y === y)&&!cyberSnake.find((obj) => obj.x === x && obj.y === y)) {
        return { x, y };
      }
    }
  };

  render() {
    const { apple } = this.props.state
    return (<>
      <Apple
        style={{ width: `${this.props.blockSize}px`, heigth: `${this.props.blockSize}px` }}
        blockSize={this.props.blockSize}
        coords={apple} />
    </>
    )
  }
}
