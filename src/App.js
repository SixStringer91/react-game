import React from "react";
import css from "./App.module.css";
import Game from "./components/Game";
import MainMenu from "./components/MainMenu.jsx";
import music from "./sounds/the-prodigy_-_narayan.mp3";
import eat from './sounds/hrum.mp3'





class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: "Versus",
			difficult: "Normal",
			areaSize: "Normal",
			gameStart: false,
			snakeLength: 3,
			musicValue:50,
      effectsValue:50
		};
	}

	componentDidMount() {
		this.musicFunc();
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.gameStart !== this.state.gameStart) {
			if(this.state.musicValue){
			this.music.volume = this.state.musicValue/100
			this.state.gameStart ? this.music.play() : this.music.pause();
		}
		if(this.state.effectsValue){
			this.eat.volume = this.state.effectsValue/100
		}
		}
	}

	musicFunc = () => {
		this.music = new Audio(music);
		this.eat = new Audio(eat);
	};

	changeSoundVolume=(target)=>{
    this.setState({
      [target.id]:target.value
    })  
	}

	makeChange = ({ type, state }) => {
		this.setState({ [type]: state });
	};
	render() {
		const { gameStart, mode, difficult, areaSize, musicValue, effectsValue} = this.state;
		return (
			<div className={css.backGround}>
				<div onClick={this.musicFunc} className={css.gameArea}>
					{gameStart ? (
						<>
							<Game
								soundEffects = {{eat: this.eat}}
								makeChange={this.makeChange}
								gameMode={{ gameStart, mode, difficult, areaSize }}
							/>
							<div className={css.counter}>
								<span>{`Snake Length: ${this.state.snakeLength}`}</span>
							</div>
						</>
					) : (
						<MainMenu
							makeChange={this.makeChange}
							type={{ mode, difficult, areaSize,musicValue,effectsValue}}
							changeSoundVolume = {this.changeSoundVolume}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default App;
