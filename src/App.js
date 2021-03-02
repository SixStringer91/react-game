import React from "react";
import css from "./App.module.css";
import Game from "./components/Game";
import MainMenu from "./components/MainMenu.jsx";
import music from "./sounds/the-prodigy_-_narayan.mp3";
import eat from './sounds/hrum.mp3';
import bang from './sounds/gameover.mp3';
import me from './img/me.jpg';
import rs from './img/rs_school_js.svg'

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
      effectsValue:50,
			areaSizePx:0
		};
		this.music = new Audio(music)
		this.soundArray = [eat,bang].map(el=>new Audio(el))
		this.ref = React.createRef();
	}

	componentDidMount() {
		this.makeChange({type:'areaSizePx',state:this.ref.current.clientHeight})
		window.addEventListener('resize',this.resizeWin);
		this.musicFunc();
	}
	componentDidUpdate(prevProps, prevState) {

		if (prevState.gameStart !== this.state.gameStart) {
			const soundArrayCopy = this.soundArray.map(el=>{
				el.volume = this.state.effectsValue/100
				return el
			});
			this.soundArray = [...soundArrayCopy];
			if(this.state.musicValue){
			this.music.volume = this.state.musicValue/100
			this.state.gameStart ? this.music.play() : this.music.pause();
		}
		}
	}

  resizeWin = ()=>{
		this.makeChange({type:'areaSizePx',state:this.ref.current.clientWidth})
		}
	

	musicFunc = () => {
	}

	changeSoundVolume=(target)=>{
    this.setState({
      [target.id]:+target.value
    })  
	}

	makeChange = ({ type, state }) => {
		this.setState({ [type]: state });
	};
	render() {
		const { gameStart, mode, difficult, areaSize, musicValue, effectsValue,areaSizePx} = this.state;
		const [eat,bang]=this.soundArray
		return (
			<div className={css.backGround}>
				<div onClick={this.musicFunc}  ref = {this.ref} className={css.gameArea}>
					{gameStart ? (
						<>
							<Game
								soundEffects = {{eat,bang,music:this.music}}
								makeChange={this.makeChange}
								gameMode={{ gameStart, mode, difficult, areaSize }}
								areaSizePx = {areaSizePx}
							/>
						</>
					) : (
						<MainMenu
							makeChange={this.makeChange}
							type={{ mode, difficult, areaSize,musicValue,effectsValue}}
							changeSoundVolume = {this.changeSoundVolume}
						/>
					)}
				</div>
				<div className={css.footer}>
					<div className={css.container}>
					<div className={css.me}>
						<a  target="_blank" href='https://github.com/SixStringer91'><img src={me}/></a>
					</div>
					<div className={css.rs}>
					<a target="_blank" href='https://rs.school/js/'><img src={rs}/></a>
					</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
