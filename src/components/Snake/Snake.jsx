import React from 'react';
import './Snake.css'

class Snake extends React.Component {
  constructor({ blockSize, segments }) {
    super({ blockSize, segments })
    this.state = {
      snakeSize: [],
      defaultStyles: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: `${blockSize}px`,
        height: `${blockSize}px`,
        border: "2px solid #F72585",
        borderRadius : '20%',
        background: '#3A0CA3',
        // zIndex: '2',
        // backgroundSize: `${blockSize * 5}px ${blockSize * 4}px`,

      }
    }
  }

  componentDidMount() {
    this.snakeMapping(this.props.segments, this.props.blockSize);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.segments !== this.props.segments) {
      this.snakeMapping(this.props.segments, this.props.blockSize)
    }
  }

  snakeMapping = (segments, blockSize) => {
  
    const newSnake = segments.map((el, i) => {
      const styles = {
        top: `${el.y * blockSize}px`,
        left: `${el.x * blockSize}px`,
        // backgroundPosition: `${blockSize * el.pic[0]}px ${blockSize * el.pic[1]}px`

      }
      return <div className={`snake`} key={i} style={{ ...this.state.defaultStyles, ...styles }} />
    })

    this.setState({ snakeSize: newSnake })
  }


  render() {
    return (
      <>
        {this.state.snakeSize}
      </>
    )
  }
}

export default Snake