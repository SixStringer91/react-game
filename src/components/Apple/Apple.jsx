import React from 'react';
import appleImg from '../../img/apple.svg'
import './Apple.css'

class Apple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultStyles:{
      width: `${this.props.blockSize}px`,
      height: `${this.props.blockSize}px`,
      top:`${this.props.blockSize*this.props.coords.y}px`,
      left:`${this.props.blockSize*this.props.coords.x}px`
    },animate: false
    }
  }



  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.coords !== this.props.coords||prevProps.blockSize!==this.props.blockSize) this.setProperties(this.props)
    if (!prevState.animate) this.setState({ animate: true })
  }
  setProperties = (props) => {
    const { blockSize, coords: { x, y } } = props;
    this.setState({
      defaultStyles: {
        ...this.state.defaultStyles,
        width: `${blockSize}px`,
        height: `${blockSize}px`,
        top:`${blockSize*y}px`,
        left:`${blockSize*x}px`
      }, animate: false
    })
  }
  componentWillUnmount() {
    console.log('удолилась');
  }
  render() {

    return (<>
      <img src={appleImg} className={`apple ${this.state.animate ? 'active' : 'noActive'}`} style={{ ...this.state.defaultStyles }} />
    </>
    )
  }
}

export default Apple