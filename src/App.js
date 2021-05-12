import React from "react";
import css from "./App.module.css";
import Game from "./components/Game.jsx";
import MainMenu from "./components/MainMenu.jsx";
import music from "./sounds/the-prodigy_-_narayan.mp3";
import eat from "./sounds/hrum.mp3";
import bang from "./sounds/gameover.mp3";
import me from "./img/me.jpg";
import rs from "./img/rs_school_js.svg";

const snapShot = JSON.parse(window.localStorage.getItem("snapshot")) || null;
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameUnmount: false,
			userStorage: snapShot,
			mode: "Versus",
			difficult: "Normal",
			areaSize: "Normal",
			GAME_START: false,
			snakeLength: 3,
			musicValue: 50,
			effectsValue: 50,
			areaSizePx: 0,
			fullScreen: false,
		};
		this.music = new Audio(music);
		this.soundArray = [eat, bang].map((el) => new Audio(el));
		this.ref = React.createRef();
		this.bgRef = React.createRef();
	}

	componentDidMount() {

		this.makeChange({
			type: "areaSizePx",
			state: this.ref.current.clientHeight,
		});
		window.addEventListener("resize", this.resizeWin);
		if (this.state.userStorage) this.setState({ GAME_START: true });

		document.addEventListener("webkitfullscreenchange",(e)=>{
			if (this.state.fullScreen&&!document.fullscreenElement) {
				this.setState({fullScreen:false})
			}		
	});

		document.addEventListener("keydown", e => {
			if(e.key == 'F11') 	{	
				e.preventDefault();
				}
		}

	);
	
	


	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.GAME_START !== this.state.GAME_START) {
			const soundArrayCopy = this.soundArray.map((el) => {
				el.volume = this.state.effectsValue / 100;
				return el;
			});
			this.soundArray = [...soundArrayCopy];
			if (this.state.musicValue && !this.state.userStorage) {
				this.music.volume = this.state.musicValue / 100;
				this.state.GAME_START ? this.music.play() : this.music.pause();
			}
		}
		this.fullScreenHandler();
		if (this.state.gameUnmount)
			this.setState({ userStorage: null, gameUnmount: false });
	}

	componentWillUnmount() {
			this.bgRef.current.removeEventListener("fullscreenchange", this.fullScrenHandler);
		window.removeEventListener("resize", this.resizeWin);
	}

	setLocalStorage = (data) => {
		localStorage.setItem("result", data);
	};

	fullScreenDisabler = (flag) => {
		if (document.cancelFullScreen) {
			if(flag) return true
			document.cancelFullScreen();

		} else if (document.mozCancelFullScreen) {
			if(flag) return true
			document.mozCancelFullScreen();

		} else if (document.webkitCancelFullScreen) {
			if(flag) return true
			document.webkitCancelFullScreen();
		}
	};

	fullScreenEnabler = (flag) => {
		if (
			!document.cancelFullScreen ||
			!document.mozCancelFullScreen ||
			!document.webkitCancelFullScreen
		) {
			if (this.bgRef.current.requestFullScreen) {
				if(flag) return true
				this.bgRef.current.requestFullScreen();	
			} else if (this.bgRef.current.mozRequestFullScreen) {
				if(flag) return true
				this.bgRef.current.mozRequestFullScreen();
			} else if (this.bgRef.current.webkitRequestFullScreen) {
				if(flag) return true
				this.bgRef.current.webkitRequestFullScreen();		
			}
		
		}
	};

	fullScreenFixer = () => {
		if (this.state.fullScreen) {
		if(this.fullScreenDisabler(true))
			this.setState({ fullScreen: false });
		}
		if (!this.state.fullScreen) {
			if(this.fullScreenEnabler(true))
			this.setState({ fullScreen: true });
		}
	};

	fullScreenHandler = () => {
		if (this.state.fullScreen) this.fullScreenEnabler();
		if (!this.state.fullScreen) this.fullScreenDisabler();
	};

	resizeWin = () => {
		this.makeChange({
			type: "areaSizePx",
			state: this.ref.current.clientWidth,
		});
	};

	changeSoundVolume = (target) => {
		this.setState({
			[target.id]: +target.value,
		});
	};

	makeChange = ({ type, state }) => {
		this.setState({ [type]: state });
	};
	render() {
		const {
			userStorage,
			fullScreen,
			GAME_START,
			mode,
			difficult,
			areaSize,
			musicValue,
			effectsValue,
			areaSizePx,
		} = this.state;
		const [eat, bang] = this.soundArray;
		return (
			<div ref={this.bgRef} className={css.backGround}>
				<div onClick={this.musicFunc} ref={this.ref} className={css.gameArea}>
					{GAME_START ? (
						<>
							<Game
								userStorage={userStorage}
								soundEffects={{ eat, bang, music: this.music }}
								makeChange={this.makeChange}
								gameMode={{ GAME_START, mode, difficult, areaSize }}
								areaSizePx={areaSizePx}
							/>
						</>
					) : (
						<MainMenu
							makeChange={this.makeChange}
							type={{
								mode,
								difficult,
								areaSize,
								musicValue,
								effectsValue,
								fullScreen,
							}}
							changeSoundVolume={this.changeSoundVolume}
						/>
					)}
				</div>
				<div className={css.footer}>
					<div className={css.container}>
						<div className={css.me}>
							<a target="_blank" href="https://github.com/SixStringer91">
								<img src={me} />
							</a>
						</div>
						<div className={css.date}>2021</div>
						<div className={css.rs}>
							<a target="_blank" href="https://rs.school/js/">
								<img src={rs} />
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
