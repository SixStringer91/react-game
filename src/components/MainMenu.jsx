import React from "react";
import css from "./MainMenu.module.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: ['Single', 'Versus', 'Autoplay'],
      difficult: ['Easy', 'Normal', 'Hard'],
      areaSize: ['Small', 'Normal', 'Big'],

    };
    this.makeChange = this.props.makeChange;
    this.changeSoundVolume  = this.props.changeSoundVolume;
  }

  handleSubmit = (e) => {
    this.props.send(this.state);
    e.preventDefault();
  }

  buttonChange = (e) => {
   const currentDiv = e.target.closest('div')
   const curValue = this.props.type[currentDiv.dataset.type]
    const target = {
      id: currentDiv.dataset.type,
      value: curValue ? 0 : 50
    }
    this.changeSoundVolume(target)
  }

  gameModeRender = (type, state) => {
  
    
    const currentType = this.props.type[type];
    const elements = state.map(el => <div className={`${css.itemWrapper} ${el === currentType ? css.chosen : ''}`}><a key={el} onMouseEnter={this.onHover} onClick={() => this.makeChange({ type, state: el })} className={css.items} href="#">{el}</a></div>)
    return <div className={css.menuItems}>{elements}</div>
  }


  render() {
    const { mode, difficult, areaSize } = this.state;
    const {musicValue,effectsValue} = this.props.type
    return (
      <>
        <div className={css.MainMenu}>
          <div className={css.logo}><h1>CyberSnake 2021</h1></div>
          <div ><h1 className={css.title}>Game Mode</h1>
            {this.gameModeRender('mode', mode)}
          </div>
          <div><h1 className={css.title}>Speed</h1>
            {this.gameModeRender('difficult', difficult)}
          </div>
          <div><h1 className={css.title}>AreaSize</h1>
            {this.gameModeRender('areaSize', areaSize)}
          </div>
          <div className={css.slideContainer}>
          <div className={css.effectContainer}>
            <span>Music volume </span> <div></div><input onChange={(e)=>this.changeSoundVolume(e.target)} id = "musicValue" type="range" min="1" max="100" value={musicValue}/>
            <div data-type="musicValue" onClick={this.buttonChange} className={css.enableSound}><a>{musicValue?'On':'Off'}</a></div>
           
            </div>
            <div className={css.effectContainer}>
            <span>Effects volume </span> <div></div><input type="range" onChange={(e)=>this.changeSoundVolume(e.target)} id = "effectsValue" min="1" max="100" value={effectsValue} />
            <div data-type="effectsValue" onClick={this.buttonChange} className={css.enableSound}><a>{effectsValue?'On':'Off'}</a></div>
       
            </div>
          </div>
  
          <div className={css.buttonWrapper}>
            <button onClick={() => this.makeChange({ type: 'gameStart', state: true })} type='button' className={css.start}>Start</button>
          </div>
        </div>
      </>
    );
  }
}

export default App;