import React from "react";
import css from "./Game.module.css";
import SnakeContainer from "./Snake/SnakeContainer.jsx";
import AppleContainer from "./Apple/AppleContainer.jsx";
import CybersnakeContainer from "./CyberSnake/CybersnakeContainer.jsx";
import bang from '../img/bubble-chat.svg'

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			areaSizePx: 768,
			gameStart: false,
		};
		this.playerScore = 0;
		this.cyberScore = 0
		this.prevKey = "d";
		this.nextKey = "d";
		this._isToShift = true;
		this._gameLoop = true;
		this.oldTime = 0;
		this.currentTime = 0;
		this.nextCyberHead = null;
		this.nextAppleDirection = null;
	}

	componentDidMount() {
		this.setState(this.setGameMode(), () => {
			this.loop(this.snakeEngine);
		});
	}

	setGameMode = () => {
		const { mode, difficult, areaSize, gameStart } = this.props.gameMode;
		const init = { gameStart };
		// let modeState, delta, areaSizeInBlocks;
		switch (difficult) {
			case "Easy":
				init.delta = 53;
				break;
			case "Normal":
				init.delta = 25;
				break;
			case "Hard":
				init.delta = 0;
				break;
		}
		switch (areaSize) {
			case "Small":
				init.areaSizeInBlocks = 10;
				break;
			case "Normal":
				init.areaSizeInBlocks = 30;
				break;
			case "Big":
				init.areaSizeInBlocks = 50;
				break;
		}
		init.apple = {};
		if (mode === "Single" || mode === "Versus"){
			init.snake = [
				{ x: 0, y: 1, pic: [2, 4] },
				{ x: 1, y: 1, pic: [2, 4] },
				{ x: 2, y: 1, pic: [1, 4] },
			];
			init.playerScore = 0
		}
		if (mode === "Versus" || mode === "Autoplay"){
			init.cyberSnake = [
				{ x: init.areaSizeInBlocks - 1, y: init.areaSizeInBlocks - 1 },
				{ x: init.areaSizeInBlocks - 2, y: init.areaSizeInBlocks - 1 },
				{ x: init.areaSizeInBlocks - 3, y: init.areaSizeInBlocks - 1 },
			];
			init.cyberScore = 0
		}
		return init;
	};

	loop = (callback) => {
		if (!this._gameLoop) {
			this.props.makeChange({ type: "snakeLength", state: 3 });
			// this.props.makeChange({ type: "gameStart", state: false });

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
				// if(prevApple) this.nextCyberHead = prevApple;
				break;
			case "snake":
				// this.setState({ [type]: [...data] });
				break;
			case "game-loop":
				this._gameLoop = false;
				break;
			case "cyberSnake":
				this.nextCyberHead = data;
				break;
			case "cyberSnakeEat":
				this.cyberScore++
				this.props.soundEffects.eat.currentTime = 0;
				this.props.soundEffects.eat.play()
				if (this.state.cyberSnake.length < this.state.areaSizeInBlocks - 1){
					this._cyberUnshift = data;
				}
				break
			case "snakeEat":
				debugger
				this.playerScore++
				this.props.soundEffects.eat.currentTime = 0;
				this.props.soundEffects.eat.play()
				if (this.state.snake.length < this.state.areaSizeInBlocks - 1){
					this._isToShift = false;
				}
				break;
		}
	};

	snakeEngine = () => {
		const objState = {};
		const {snake,cyberSnake} = this.state
		if (this.nextAppleDirection) {
			objState.apple = this.nextAppleDirection;
			this.nextAppleDirection = null;
		}
		if (snake) {
			objState.snake = this.playerUpdater().snake;
			if(this.playerScore>this.state.playerScore)objState.playerScore=this.state.playerScore+1
		}
		if (cyberSnake) {
			objState.cyberSnake = this.cyborgUpdater().cyberSnake
			if(this.cyberScore>this.state.cyberScore)objState.cyberScore = this.cyberScore
		};
		if (objState.cyberSnake&&objState.snake){
			const cyberHead = objState.cyberSnake[objState.cyberSnake.length-1];
			const snakeHead = objState.snake[objState.snake.length-1];
		  const cyberFind = objState.cyberSnake.find(el=>snakeHead.x===el.x&&snakeHead.y===el.y);
		  const snakeFind = objState.snake.find(el=>cyberHead.x===el.x&&cyberHead.y===el.y)
			if(cyberFind||snakeFind) this._gameLoop=!this._gameLoop
		}
		this.setState({ ...objState })
	}

	cyborgUpdater = () => {
		const cyberSnake = [...this.state.cyberSnake];
		const head = cyberSnake[cyberSnake.length - 1];
		const { x, y } = this.renderPartsOfSnake(head, this.nextCyberHead);

		// const cyberSnake = [...this.state.cyberSnake];
		this._cyberUnshift ? (this._cyberUnshift = false) : cyberSnake.shift();
		//   cyberSnake.push(this.nextCyberHead)
		// 	this.nextAppleDirection = null;
		// }
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

	renderPartsOfSnake = (head, key, body) => {
		let x = head.x;
		let y = head.y;
		const size = this.state.areaSizeInBlocks - 1;
		switch (key) {
			case "w":
				y = head.y - 1 < 0 ? size : head.y - 1;

				if (body) {
					body.headPic = [2, 4];
					if (this.prevKey !== key) {
						this.prevKey === "a"
							? (body.neckPic = [5, 3])
							: (body.neckPic = [3, 2]);
					} else body.neckPic = [3, 3];
				}
				break;
			case "a":
				x = head.x - 1 < 0 ? size : head.x - 1;
				if (body) {
					body.headPic = [2, 3];
					if (this.prevKey !== key) {
						this.prevKey === "s"
							? (body.neckPic = [3, 2])
							: (body.neckPic = [3, 4]);
					} else body.neckPic = [4, 4];
				}
				break;
			case "s":
				y = head.y + 1 > size ? 0 : head.y + 1;
				if (body) {
					body.headPic = [1, 3];
					if (this.prevKey !== key) {
						this.prevKey === "a"
							? (body.neckPic = [5, 4])
							: (body.neckPic = [3, 4]);
					} else body.neckPic = [3, 3];
				}
				break;
			case "d":
				x = head.x + 1 > size ? 0 : head.x + 1;
				if (body) {
					body.headPic = [1, 4];
					if (this.prevKey !== this.nextKey) {
						this.prevKey === "s"
							? (body.neckPic = [5, 3])
							: (body.neckPic = [5, 4]);
					} else body.neckPic = [4, 4];
				}
				break;
		}
		return { x, y };
	};

	buttonListener = (key) => {
		this.nextKey = key;
	};

	render() {
		const {
			apple,
			snake,
			areaSizePx,
			areaSizeInBlocks,
			gameStart,
			cyberSnake,
			playerScore
		} = this.state;
		const blockSize = areaSizePx / areaSizeInBlocks;
		return (
			<>
				{gameStart ? (
					<div
					 
						className={css.gameArea}
						style={{ width: `${areaSizePx}px`, height: `${areaSizePx}px` }}
					>
						{this._gameLoop? null : <img style ={{position:'absolute'}} width={areaSizePx} height={areaSizePx} src={bang}/>}
						<div className={css.playerScore}>
							<div>Score</div>
							<div className={css.tabloid}>{playerScore}</div>
						</div>
						{snake ? (
							<SnakeContainer
								buttonListener={this.buttonListener}
								stateUpdater={this.stateUpdater}
								prevKey={this.prevKey}
								nextKey={this.nextKey}
								state={{ apple, snake }}
								blockSize={blockSize}
								areaSizeInBlocks={areaSizeInBlocks}
							/>
						) : null}

						{cyberSnake ? (
							<CybersnakeContainer
								apple={apple}
								snake={snake}
								cyberSnake={cyberSnake}
								stateUpdater={this.stateUpdater}
								blockSize={blockSize}
								areaSizeInBlocks={areaSizeInBlocks}
							/>
						) : null}

						<AppleContainer
							stateUpdater={this.stateUpdater}
							state={{ apple, snake, cyberSnake }}
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
