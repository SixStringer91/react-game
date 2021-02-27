import React from 'react';
import './Apple.css'

class Apple extends React.Component {
  constructor({ blockSize, coords: { x, y } }) {
    super({ blockSize, x, y });
    this.state = {
      defaultStyles: {
        backgroundSize: `${blockSize * 5}px ${blockSize * 4}px`,
        backgroundPosition: `0 100%`
      },
      animate: false
    }
  }



  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.coords !== this.props.coords) this.setProperties(this.props)
    if (!prevState.animate) this.setState({ animate: true })
  }
  setProperties = (props) => {
    const { blockSize, coords: { x, y } } = props;
    this.setState({
      defaultStyles: {
        ...this.state.defaultStyles,
        width: `${blockSize}px`,
        height: `${blockSize}px`,
        top: `${y * blockSize}px`,
        left: `${x * blockSize}px`,
      }, animate: false
    })
  }
  componentWillUnmount() {
    console.log('удолилась');
  }
  render() {

    return (<>
      <div className={`apple ${this.state.animate ? 'active' : 'noActive'}`} style={{ ...this.state.defaultStyles }} />
    </>
    )
  }
}

export default Apple