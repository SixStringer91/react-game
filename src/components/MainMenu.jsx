import React from "react";
import css from "./MainMenu.module.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: ['Single','Versus','Autoplay'],
      difficult: ['Easy','Normal','Hard'],
      areaSize: ['Small','Normal','Big'],
    };
    this.makeChange = this.props.makeChange;
  }


handleSubmit = (e) => {
  this.props.send(this.state);
  e.preventDefault();
}


gameModeRender = (type, state) => {
const currentType = this.props.type[type];
  const elements = state.map(el => <a key={el} onClick={() => this.makeChange({ type, state:el })}  className={`${css.items} ${el===currentType?css.chosen:''}`} href="#">{el}</a>)
  return <div className={css.menuItems}>{elements}</div>
}



render() {
  const { mode, difficult, areaSize } = this.state;
  return (
  <>
      <div className={css.MainMenu}>
        <div className="Game_Title"><h1 className={css.title}>CyberSnake 2021</h1></div>
        <div ><h1 className={css.title}>Game Mode</h1>
          {this.gameModeRender('mode', mode)}
        </div>
        <div><h1 className={css.title}>Difficult</h1>
          {this.gameModeRender('difficult', difficult)}
        </div>
        <div><h1 className={css.title}>AreaSize</h1>
          {this.gameModeRender('areaSize', areaSize)}
        </div>
        <button onClick={() => this.makeChange({type:'gameStart',state:true})} type='button' className={css.start}>Start</button>
      </div>
    </>
  );
}
}

export default App;