import React from 'react';
import Apple from './Apple'
import './Apple.css'


export default class AppleContainer extends React.Component {
  componentDidMount() {
    this.props.stateUpdater('apple', this.appleNewDirection())
  }


  componentDidUpdate({ state: { apple: prevApple } }) {
    const { apple, snake, cyberSnake } = this.props.state
    if(snake){
      this.isCollision(snake);
    }
  
  if(cyberSnake){
      this.isCollision(cyberSnake);   
    }
  }
  isCollision = (someSnake) => {
    const { apple } = this.props.state;
    const { x, y } = someSnake[someSnake.length - 1];
    if (y === apple.y && x === apple.x) {
      this.props.stateUpdater('apple', this.appleNewDirection())
    }

  }
  appleNewDirection = () => {
    const { state: { snake, cyberSnake }, areaSizeInBlocks } = this.props;
    let checkBody = true;
    while (checkBody) {
      const x = Math.floor(Math.random() * (areaSizeInBlocks - 1));
      const y = Math.floor(Math.random() * (areaSizeInBlocks - 1));
      const isCyberSnake = cyberSnake ? !cyberSnake.find((obj) => obj.x === x && obj.y === y) : true;
      const isSnake = snake ? !snake.find((obj) => obj.x === x && obj.y === y) : true;
      if (isCyberSnake && isSnake) {
        return { x, y };
      }
    }
  };

  render() {
    const { blockSize, state: { apple } } = this.props
    return (<>
      <Apple
        style={{ width: `${blockSize}px`, heigth: `${blockSize}px` }}
        blockSize={blockSize}
        coords={apple} />
    </>
    )
  }
}
