import React from "react";
import css from "./Game.module.css";
import SnakeContainer from "./Snake/SnakeContainer.jsx";
import AppleContainer from "./Apple/AppleContainer.jsx";
import CybersnakeContainer from "./CyberSnake/CybersnakeContainer.jsx";
import Bang from "./Bang/Bang";
import Score from './Score/Score'
import Pause from './Pause/Pause'

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			areaSizePx: this.props.areaSizePx,
			gameStart: false,
			paused:false
		};
		this.pausing = false;
		this.makeChange = this.props.makeChange;
		this.playerScore = 0;
		this.cyberScore = 0;
		this.prevKey = "d";
		this.nextKey = "d";
		this._isToShift = true;
		this._gameLoop = true;
		this.oldTime = 0;
		this.currentTime = 0;
		this.nextCyberHead = null;
		this.nextAppleDirection = null;
		this.nextApple2Direction = null;
	}

	componentDidMount() {
		this.setState(this.setGameMode(), () => {
			this.loop(this.snakeEngine);
		});
		window.addEventListener('beforeunload',this.updateStateInStorage);
		window.addEventListener('keyup',this.pauseHandler)
	}

	componentWillUnmount(){

	}

	updateStateInStorage = ()=>{
		const {
			state,
			playerScore,
			cyberScore,
			prevKey,
			nextKey,
			_isToShift,
			_gameLoop,
			oldTime,
			currentTime,
			nextCyberHead,
			nextAppleDirection,
		} = this;
		const propSnap = {
			state,
			classProps: {
				playerScore,
				cyberScore,
				prevKey,
				nextKey,
				_isToShift,
				_gameLoop,
				oldTime,
				currentTime,
				nextCyberHead,
				nextAppleDirection,
			},
			musicCurrentTime:this.props.soundEffects.music.currentTime
		};
if(this.state.gameStart&&this._gameLoop)this.localStorageUpdater("snapshot", propSnap);

}

	localStorageUpdater = (type, obj)=>{
		if(obj)localStorage.setItem(type, JSON.stringify(obj))
		else window.localStorage.removeItem(type)
	}

	componentDidUpdate(){
		if(this.props.areaSizePx!==this.state.areaSizePx){
			this.setState({areaSizePx:this.props.areaSizePx})
		}
		
	}
	componentWillUnmount(){
		window.removeEventListener('beforeunload',this.updateStateInStorage);
		window.removeEventListener('keyup',this.pauseHandler)
	}

	setGameMode = () => {
	const userScoreSingle = JSON.parse(window.localStorage.getItem('single'))||0;
	const userScoreVersus = JSON.parse(window.localStorage.getItem('versus'))||0;
	const userScoreAuto = JSON.parse(window.localStorage.getItem('autoplay'))||0;
	let init = {};
	if(this.props.userStorage){
		init = {...this.props.userStorage.state}
		this.pausing = true;
		init.paused = true;
		for (let keys in this.props.userStorage.classProps) {
			this.hasOwnProperty(keys) || (this[keys] = this.props.userStorage.classProps[keys]);
		};
		this.props.soundEffects.music.currentTime = this.props.userStorage.musicCurrentTime;
		this.stateUpdater('gameStart',true)
	}
	else{
		const {gameMode:{mode, difficult, areaSize, gameStart}} = this.props;
		init.gameStart = gameStart;
		switch (difficult) {
			case "Easy":
				init.delta = 45;
				break;
			case "Normal":
				init.delta = 33;
				break;
			case "Hard":
				init.delta = 10;
				break;
		}
		switch (areaSize) {
			case "Small":
				init.areaSizeInBlocks = 20;
				break;
			case "Normal":
				init.areaSizeInBlocks = 35;
				break;
			case "Big":
				init.areaSizeInBlocks = 60;
				break;
		}
		init.apple = {};
		init.apple2 = {};
		init.mode = mode
		if (mode === "Single" || mode === "Versus") {
			init.snake = [
				{ x: 0, y: 1},
				{ x: 1, y: 1},
				{ x: 2, y: 1},
			];
			init.playerScore = 0;
		}
		if (mode === "Versus" || mode === "Autoplay") {
			init.cyberSnake = [
				{ x: init.areaSizeInBlocks - 1, y: init.areaSizeInBlocks - 1 },
				{ x: init.areaSizeInBlocks - 2, y: init.areaSizeInBlocks - 1 },
				{ x: init.areaSizeInBlocks - 3, y: init.areaSizeInBlocks - 1 },
			];
			init.cyberScore = 0;
			init.snake = [
				{ x: 0, y: 1},
				{ x: 1, y: 1},
				{ x: 2, y: 1},
			];
			init.playerScore = 0;
		}
	}
	if(init.mode==='Versus')init.yourBestScore = userScoreVersus;
	else if(init.mode==='Single')init.yourBestScore = userScoreSingle;
	else if(init.mode==='Autoplay')init.yourBestScore = userScoreAuto;
		return init;
	};

	loop = (callback) => {
		if (!this._gameLoop) {
			window.removeEventListener('beforeunload',this.updateStateInStorage);
			this.localStorageUpdater('snapshot', null)
					return;
		}
		this.currentTime = Date.now();
		if (this.oldTime === 0) {
			this.oldTime = this.currentTime;
		}
		if (this.currentTime - this.oldTime >= this.state.delta) {
			callback();
			this.oldTime = this.currentTime;
		}
		requestAnimationFrame(() => this.loop(callback));
	};

	stateUpdater = (type, data) => {
		switch (type) {
			case "apple":
				this.nextAppleDirection = data;
				break;
				case "apple2":
					this.nextApple2Direction = data;
					break;
			case "snake":
				if(!this.state.paused)this.nextKey = data;
				break;
				case "cyberSnake":
				this.nextCyberHead = data;
				break;
			case "game-loop":
				this._gameLoop = data;
				break;	
			case "cyberSnakeEat":
				if(!this.state.paused){	
				this.cyberScore++;
				this.props.soundEffects.eat.currentTime = 0;
				this.props.soundEffects.eat.play();
				if (this.state.cyberSnake.length < this.state.areaSizeInBlocks - 1) {
					this._cyberUnshift = data;
				}
			}
				break;
			case "snakeEat":	
			if(!this.state.paused){		
				this.playerScore++;
				this.props.soundEffects.eat.currentTime = 0;
				this.props.soundEffects.eat.play();
				if (this.state.snake.length < this.state.areaSizeInBlocks - 1) {
					this._isToShift = false;
				}
			}
				break;
				case 'gameStart':
					this.makeChange({type, state:data});
				 break
		}
	};

	snakeEngine = () => {
		const objState = {};
		const { paused, snake, cyberSnake,yourBestScore, mode } = this.state;
		if(!paused){
		if(this.playerScore>yourBestScore){
		
			this.localStorageUpdater(mode.toLowerCase(),this.playerScore)
			objState.yourBestScore = this.playerScore
		}
		
		if (this.nextAppleDirection) {
			objState.apple = this.nextAppleDirection;
			this.nextAppleDirection = null;
		}
		if (this.nextApple2Direction) {
			objState.apple2 = this.nextApple2Direction;
			this.nextApple2Direction = null;
		}
		if (snake) {
			objState.snake = this.playerUpdater().snake;
			if (this.playerScore > this.state.playerScore)
				objState.playerScore = this.state.playerScore + 1;
		}
		if (cyberSnake) {
			objState.cyberSnake = this.cyborgUpdater().cyberSnake;
			if (this.cyberScore > this.state.cyberScore)
				objState.cyberScore = this.cyberScore;
		}
		if (objState.cyberSnake && objState.snake) {
			const cyberHead = objState.cyberSnake[objState.cyberSnake.length - 1];
			const snakeHead = objState.snake[objState.snake.length - 1];
			const snakeFind = objState.cyberSnake.find(
				(el) => snakeHead.x === el.x && snakeHead.y === el.y
			);
			const cyberFind = objState.snake.find(
				(el) => cyberHead.x === el.x && cyberHead.y === el.y
			);
			if (cyberFind || snakeFind) {
				if(cyberFind)objState.bangCoords = cyberHead;
				else objState.bangCoords = snakeHead;
				this._gameLoop = !this._gameLoop;
				this.props.soundEffects.music.currentTime = 0;
				this.props.soundEffects.music.pause();
				this.props.soundEffects.bang.play();
			}
			}
		}
		if(this.pausing!==paused){
			objState.paused = this.pausing		
		}
		this.setState({ ...objState });
	};

	cyborgUpdater = () => {
		const cyberSnake = [...this.state.cyberSnake];
		const head = cyberSnake[cyberSnake.length - 1];
		const { x, y } = this.renderPartsOfSnake(head, this.nextCyberHead);
		this._cyberUnshift ? (this._cyberUnshift = false) : cyberSnake.shift();
		return { cyberSnake: [...cyberSnake, { x, y }] };
	};

	playerUpdater = () => {
		const snake = [...this.state.snake];
		const head = snake[snake.length - 1];
		const neck = snake[snake.length - 2];
		const tail = snake[0];
		const body = {
			headPic: head.pic,
			neckPic: neck.pic,
			tailPic: tail.pic,
		};
		const { x, y } = this.renderPartsOfSnake(head, this.nextKey, body);
		if (this._isToShift) snake.shift();
		else {
			this._isToShift = true;
		}
		this.prevKey = this.nextKey;
		snake[snake.length - 1] = {
			...snake[snake.length - 1],
			pic: body.neckPic,
		};
		return { snake: [...snake, { x, y, pic: body.headPic }] };
	};

	renderPartsOfSnake = (head, key) => {
		let x = head.x;
		let y = head.y;
		const size = this.state.areaSizeInBlocks - 1;
		switch (key) {
			case "w":
				y = head.y - 1 < 0 ? size : head.y - 1;
				break;
			case "a":
				x = head.x - 1 < 0 ? size : head.x - 1;
				break;
			case "s":
				y = head.y + 1 > size ? 0 : head.y + 1;
				break;
			case "d":
				x = head.x + 1 > size ? 0 : head.x + 1;
				break;
		}
		return { x, y };
	};



	pauseHandler = e =>{
		if(e.key === ' '&&!this.state.paused){
			this.pausing=!this.pausing;
			this.props.soundEffects.music.pause();
		}
		else if(e.key === ' '&&this.state.paused){
		this.props.soundEffects.music.play();
		this.pausing=!this.pausing;
	}
		else if(e.key === 'r'&&this.state.paused){
		this.props.soundEffects.music.currentTime = 0;	
		this.stateUpdater('game-loop',false)
		this.stateUpdater('gameStart',false);
	}
	}


	render() {
		const {
			mode,
			paused,
			apple,
			apple2,
			snake,
			areaSizePx,
			areaSizeInBlocks,
			gameStart,
			cyberSnake,
			playerScore,
			yourBestScore,
			bangCoords
		} = this.state;
		const blockSize = areaSizePx / areaSizeInBlocks;
		return (
			<>
				{gameStart ? (
					<div
						className={css.gameArea}
						style={{ width: `${areaSizePx}px`, height: `${areaSizePx}px` }}
					>
						{!bangCoords ? null : (
							<Bang areaSizePx={areaSizePx} stateUpdater={this.stateUpdater} blockSize={blockSize} bangCoords={bangCoords} />
						)}
							<Score playerScore = {playerScore} yourBestScore = {yourBestScore} />
							{paused?<Pause/>:null}
						{snake && mode!=='Autoplay' ? (
							<SnakeContainer
								background={'#3A0CA3'}
								buttonListener={this.buttonListener}
								stateUpdater={this.stateUpdater}
								prevKey={this.prevKey}
								nextKey={this.nextKey}
								state={{ apple, apple2, snake }}
								blockSize={blockSize}
								areaSizeInBlocks={areaSizeInBlocks}
							/>
						) : null}

						{cyberSnake ? (
							<CybersnakeContainer
								method={'cyberSnake'}
								background={'#03045e'}
								apple={apple}
								apple2={apple2}
								snake={snake}
								cyberSnake={cyberSnake}
								stateUpdater={this.stateUpdater}
								blockSize={blockSize}
								areaSizeInBlocks={areaSizeInBlocks}
							/>
						) : null}
{mode==='Autoplay'?

	<CybersnakeContainer
		method={'snake'}
		background={'#3A0CA3'}
		apple={apple}
		apple2={apple2}
		snake={cyberSnake}
		cyberSnake={snake}
		stateUpdater={this.stateUpdater}
		blockSize={blockSize}
		areaSizeInBlocks={areaSizeInBlocks}
	/>

:null
}
						<AppleContainer
							method = {'apple'}
							stateUpdater={this.stateUpdater}
							state={{apple, snake, cyberSnake}}
							secApple = {apple2}
							blockSize={blockSize}
							areaSizeInBlocks={areaSizeInBlocks}
						/>
							<AppleContainer
							method = {'apple2'}
							stateUpdater={this.stateUpdater}
							state={{apple:apple2, snake, cyberSnake
							}}
							secApple = {apple}
							blockSize={blockSize}
							areaSizeInBlocks={areaSizeInBlocks}
						/>
					</div>
				) : (
					<img></img>
				)}
			</>
		);
	}
}

export default Game;