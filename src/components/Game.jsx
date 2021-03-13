import React from "react";
import css from "./Game.module.css";
import SnakeContainer from "./Snake/SnakeContainer.jsx";
import AppleContainer from "./Apple/AppleContainer.jsx";
import CybersnakeContainer from "./CyberSnake/CybersnakeContainer.jsx";
import Bang from "./Bang/Bang";
import Score from './Score/Score'
import Pause from './Pause/Pause'
import PreLoader from './PreLoader/PreLoader'

const backendServer = 'https://afternoon-shore-85753.herokuapp.com/'

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			areaSizePx: this.props.areaSizePx,
			GAME_START: false,
			paused: false
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

		this.serverRequest('GET').then(data => {

			this.setState(this.setGameMode(data), () => {
				this.loop(this.snakeEngine);
				window.addEventListener('beforeunload', this.updateStateInStorage);
				window.addEventListener('keyup', this.pauseHandler)
			})

		})

	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.areaSizePx !== this.state.areaSizePx) {
			this.setState({ areaSizePx: this.props.areaSizePx })
		}

	}
	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.updateStateInStorage);
		window.removeEventListener('keyup', this.pauseHandler);
		this.makeChange({ type: 'gameUnmount', state: true })
	}

	serverRequest = async (method, data) => {
		const url = `${backendServer}${this.props.gameMode.mode.toLowerCase()}`
		if (method === 'GET') {
			const request = await fetch(url)
				.then(response => response.json()).catch(err => console.log(err))
			return request
		}
		else if (method === 'POST') {
			debugger
			const body = {
				type: this.props.gameMode.mode.toLowerCase(),
				result: data
			}
			const request = await fetch(url, {
				method: method,
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'text/plain'
				}
			})
			console.log(request)
		}

	}

	setGameMode = (data) => {
		const userScore = JSON.parse(window.localStorage.getItem(this.props.gameMode.mode.toLowerCase())) || 0;
		let init = {};
		if (data.type) {
			init.bestOfAll = data.result >= userScore ? data.result : userScore;
			if (init.bestOfAll > data.result) this.stateUpdater('NEW_RECORD', init.bestOfAll);

		};
		if (this.props.userStorage) {
			init = { ...this.props.userStorage.state }
			this.pausing = true;
			init.paused = true;
			for (let keys in this.props.userStorage.classProps) {
				this.hasOwnProperty(keys) || (this[keys] = this.props.userStorage.classProps[keys]);
			};
			this.props.soundEffects.music.currentTime = this.props.userStorage.musicCurrentTime;
			this.stateUpdater('GAME_START', true)
		}
		else {
			const { gameMode: { mode, difficult, areaSize, GAME_START } } = this.props;
			init.GAME_START = GAME_START;
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
					{ x: 0, y: 1 },
					{ x: 1, y: 1 },
					{ x: 2, y: 1 },
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
					{ x: 0, y: 1 },
					{ x: 1, y: 1 },
					{ x: 2, y: 1 },
				];
				init.playerScore = 0;
			}
		}
		init.yourBestScore = userScore;

		return init;
	};

	updateStateInStorage = () => {
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
			musicCurrentTime: this.props.soundEffects.music.currentTime
		};
		if (this.state.GAME_START && this._gameLoop) this.localStorageUpdater("snapshot", propSnap);

	}

	localStorageUpdater = (type, obj) => {
		if (obj) localStorage.setItem(type, JSON.stringify(obj))
		else window.localStorage.removeItem(type)
	}





	loop = (callback) => {
		if (!this._gameLoop) {
			window.removeEventListener('beforeunload', this.updateStateInStorage);
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
			case "APPLE":
				this.nextAppleDirection = data;
				break;
			case "APPLE_2":
				this.nextApple2Direction = data;
				break;
			case "SNAKE":
				if (!this.state.paused) this.nextKey = data;
				break;
			case "CYBERSNAKE":
				this.nextCyberHead = data;
				break;
			case "GAME_LOOP":
				this._gameLoop = data;
				break;
			case "SELF_COLLISION":
				this._selfCollision = true;
				break

			case "CYBERSNAKE_EAT":
				if (!this.state.paused) {
					this.cyberScore++;
					this.props.soundEffects.eat.currentTime = 0;
					this.props.soundEffects.eat.play();
					if (this.state.cyberSnake.length < this.state.areaSizeInBlocks - 1) {
						this._cyberUnshift = data;
					}
				}
				break;
			case "SNAKE_EAT":
				debugger
				if (!this.state.paused) {
					this.playerScore++;
					this.props.soundEffects.eat.currentTime = 0;
					this.props.soundEffects.eat.play();
					if (this.state.snake.length < this.state.areaSizeInBlocks - 1) {
						this._isToShift = false;
					}
				}
				break;
			case "GAME_START":
				this.makeChange({ type, state: data });
				break
			case "NEW_RECORD":
				this.serverRequest('POST', data)
				break
		}
	};

	snakeEngine = () => {
		const objState = {};
		const { paused, mode, snake, cyberSnake, yourBestScore, bestOfAll } = this.state;



		if (!paused) {
			if (this.playerScore > yourBestScore) {
				this.localStorageUpdater(mode.toLowerCase(), this.playerScore)
				objState.yourBestScore = this.playerScore;
				if (this.playerScore > bestOfAll) {
					objState.bestOfAll = this.playerScore;
					this.stateUpdater('NEW_RECORD', this.playerScore)
				}
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
				if (this._selfCollision) {
					const snakeHead = objState.snake[objState.snake.length - 1];
					objState.bangCoords = snakeHead;
					this.stateUpdater('GAME_LOOP', false)
					this.props.soundEffects.music.currentTime = 0;
					this.props.soundEffects.music.pause();
					this.props.soundEffects.bang.play();
				}
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
					if (cyberFind) objState.bangCoords = cyberHead;
					else objState.bangCoords = snakeHead;
					this.stateUpdater('GAME_LOOP', false)
					this.props.soundEffects.music.currentTime = 0;
					this.props.soundEffects.music.pause();
					this.props.soundEffects.bang.play();
				}
			}
		}
		if (this.pausing !== paused) {
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



	pauseHandler = e => {
		if (e.key === ' ' && !this.state.paused) {
			this.pausing = !this.pausing;
			this.props.soundEffects.music.pause();
		}
		else if (e.key === ' ' && this.state.paused) {
			this.props.soundEffects.music.play();
			this.pausing = !this.pausing;
		}
		else if (e.keyCode === 82 && this.state.paused) {

			this.props.soundEffects.music.currentTime = 0;
			this.stateUpdater('GAME_LOOP', false);

			this.makeChange({ type: 'GAME_START', state: false });
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
			GAME_START,
			cyberSnake,
			playerScore,
			yourBestScore,
			bestOfAll,
			bangCoords
		} = this.state;
		const blockSize = areaSizePx / areaSizeInBlocks;
		return (
			<>
				{
					GAME_START ? (
						<div
							className={css.gameArea}
							style={{ width: `${areaSizePx}px`, height: `${areaSizePx}px` }}
						>
							{!bangCoords ? null : (
								<Bang areaSizePx={areaSizePx} stateUpdater={this.stateUpdater} blockSize={blockSize} bangCoords={bangCoords} />
							)}
							<Score playerScore={playerScore} yourBestScore={yourBestScore} bestOfAll={bestOfAll} />
							{paused ? <Pause /> : null}
							{snake && mode !== 'Autoplay' ? (
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
									method={"CYBERSNAKE"}
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
							{mode === 'Autoplay' ?

								<CybersnakeContainer
									method={"SNAKE"}
									background={'#3A0CA3'}
									apple={apple}
									apple2={apple2}
									snake={cyberSnake}
									cyberSnake={snake}
									stateUpdater={this.stateUpdater}
									blockSize={blockSize}
									areaSizeInBlocks={areaSizeInBlocks}
								/>

								: null
							}
							<AppleContainer
								method={"APPLE"}
								stateUpdater={this.stateUpdater}
								state={{ apple, snake, cyberSnake }}
								secApple={apple2}
								blockSize={blockSize}
								areaSizeInBlocks={areaSizeInBlocks}
							/>
							<AppleContainer
								method={"APPLE_2"}
								stateUpdater={this.stateUpdater}
								state={{
									apple: apple2, snake, cyberSnake
								}}
								secApple={apple}
								blockSize={blockSize}
								areaSizeInBlocks={areaSizeInBlocks}
							/>
						</div>
					) : (
						<PreLoader />
					)
				}
			</>
		);
	}
}

export default Game;
