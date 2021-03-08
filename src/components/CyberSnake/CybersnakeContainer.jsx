import React from 'react';
import Snake from '../Snake/Snake.jsx'

export default class CybersnakeContainer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			defaultStyles: {
				boxSizing: 'border-box',
				position: 'absolute',
				width: `${this.props.blockSize}px`,
				height: `${this.props.blockSize}px`,
				border: "2px solid #F72585",
				borderRadius: '20%',
				background: this.props.background,
			},
			path: {}
		}
		this.stateUpdater = this.props.stateUpdater

	}


	componentDidUpdate({ apple, apple2, cyberSnake, blockSize, snake }) {
		if (cyberSnake !== this.props.cyberSnake) {
			this.cyberSnakeUpdater(apple, apple2, cyberSnake, snake)
		}
		if (blockSize !== this.props.blockSize) {
			this.setState({
				defaultStyles: {
					...this.state.defaultStyles, width: `${this.props.blockSize}px`,
					height: `${this.props.blockSize}px`
				}
			})

		}
	}


	cyberSnakeUpdater = (apple, apple2, cyberSnake, snake) => {
		const method = this.props.method
		const appleCheck = this.headsCheck(snake, apple);
		const apple2Check = this.headsCheck(snake, apple2)
		const appleChange = apple !== this.props.apple || apple2 !== this.props.apple2;
		const cyberChange = cyberSnake !== this.props.cyberSnake;
		const head = this.props.cyberSnake[this.props.cyberSnake.length - 1];
		const headEqualApple = (head.x === apple.x && head.y === apple.y) || (head.x === apple2.x && head.y === apple2.y);
		let direction;
		if (headEqualApple) {
			this.stateUpdater(`${method}_EAT`, true);
		}
		else if (appleChange || cyberChange) {
			const { apple, apple2 } = this.props
			let needledDest;
			if (appleCheck) needledDest = apple2
			else if (apple2Check) needledDest = apple;
			else needledDest = appleChange || headEqualApple ? this.minDestination(head, apple, apple2) : this.state.currentApple||{x:0,y:0};

			const newPath = this.pathfinder(needledDest, this.props.cyberSnake, this.props.areaSizeInBlocks, this.props.snake);
			if (newPath.length) {
				direction = this.snakeDirection(head, newPath[0]);
				this.stateUpdater(method, direction);
				newPath.shift();
				this.setState({ path: newPath, currentApple: needledDest });
			}
		}
	}

	headsCheck(snake, apple) {
		const check = snake.find(el => {
			if (apple.x - 1 == el.x && apple.y == el.y) return el;
			if (apple.x == el.x && apple.y - 1 == el.y) return el;
			if (apple.x + 1 == el.x && apple.y == el.y) return el;
			if (apple.x == el.x && apple.y + 1 == el.y) return el;
		})
		if (check) return true
	}

	minDestination = (head, el1, el2) => {
		const first = this.destination(head, el1);
		const second = this.destination(head, el2);
		if (first < second) return el1
		else return el2
	}

	destination = (head, el) => {
		const diffX = head.x - el.y
		const diffY = head.x - el.y
		return Math.floor(Math.sqrt(diffX * diffX + diffY * diffY))
	}


	snakeDirection = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
		if (x1 === x2) {
			if (y2 > y1) return 's';
			if (y1 > y2) return 'w';
		}
		else if (y1 === y2) {
			if (x2 > x1) return 'd';
			if (x1 > x2) return 'a';
		}
	}

	pathfinder(
		apple,
		snake,
		mapSize,
		enemySnake
	) {

		const startPropeties = {
			xStart: snake[snake.length - 1].x,
			yStart: snake[snake.length - 1].y,
			xEnd: apple.x,
			yEnd: apple.y
		}
		const mapBarrier = (() => {
			const array = ([...Array(mapSize)].map(() => [...Array(mapSize)].map(() => 1)));
			snake.forEach((el, i, arr) => {
				if (i !== arr.length - 1)
					array[el.y][el.x] = 0
			})
			enemySnake.forEach((el, i, arr) => {
				array[el.y][el.x] = 0
				if (el.y < mapSize - 1) array[el.y + 1][el.x] = 0;
				if (el.y > 0) array[el.y - 1][el.x] = 0;
				if (el.x < mapSize - 1) array[el.y][el.x + 1] = 0;
				if (el.x > 0) array[el.y][el.x - 1] = 0
				if (el.y + 1 < mapSize - 1) array[el.y + 2][el.x] = 0;
				if (el.y > 1) array[el.y - 2][el.x] = 0;
				if (el.x + 1 < mapSize - 1) array[el.y][el.x + 2] = 0;
				if (el.x > 1) array[el.y][el.x - 2] = 0


			})
			return array
		})();


		const mapPath = [...Array(mapSize)].map(() => [...Array(mapSize)].map(() => 0));
		let changeProps = {
			endCircle: false,
			mShX: [0],
			mShY: [0],
			mShN: [0],
			mDX: [0, 1, 0, -1],
			mDY: [-1, 0, 1, 0],
			finalPath: [],
			xCur: startPropeties.xStart,
			yCur: startPropeties.yStart,
			lastStep: 0,
			curStep: 0,
			checkStep: null,
			mapPath,
			lastStepCheck: 0,
			counter: 0
		}
		const maps = {
			mapSize, mapBarrier
		}


		while (!changeProps.endCircle) {
			changeProps.lastStepCheck = changeProps.lastStep
			const newChangeProps = { ...this.circle(startPropeties, changeProps, maps, this.pathBuilder) };
			changeProps = { ...changeProps, ...newChangeProps }
			if (changeProps.lastStep === changeProps.lastStepCheck) {
				changeProps.counter++
				if (changeProps.counter > 30) {
					break
				}
			}
			else {
				changeProps.counter = 0
			}
			if (changeProps.curStep < changeProps.lastStep) {
				changeProps.curStep++;
				changeProps.xCur = changeProps.mShX[changeProps.curStep];
				changeProps.yCur = changeProps.mShY[changeProps.curStep];
			}
		}

		return changeProps.finalPath;
	}

	circle = ({ xEnd, yEnd, xStart, yStart },
		{ mShX, mShY, mShN, mDX, mDY, xCur, yCur, lastStep, endCircle, finalPath, mapPath },
		{ mapBarrier, mapSize },
		pathBuilderHandler) => {
		const checkStep = lastStep

		for (let i = 0; i < 4; i++) {
			const dX = mDX[i];
			const dY = mDY[i];
			let newX = xCur + dX;
			let newY = yCur + dY;
			if (newX <= 0) {
				newX = 0;
			} else if (newX >= mapSize - 1) {
				newX = mapSize - 1;
			}
			if (newY <= 0) {
				newY = 0;
			} else if (newY >= mapSize - 1) {
				newY = mapSize - 1;
			}
			const checkWalls = mapBarrier[newY][newX] === 1 && mapPath[newY][newX] === 0
			if (checkWalls) {

				lastStep++;

				mShX[lastStep] = newX;
				mShY[lastStep] = newY;
				mShN[lastStep] = i;
				mapPath[newY][newX] = i + 1;
				if (newX === xEnd && newY === yEnd) {
					finalPath = [...pathBuilderHandler({ xEnd, yEnd, xStart, yStart }, { mDX, mDY, finalPath, mapPath })]
					endCircle = true;
					return { mShX, mShY, mShN, lastStep, endCircle, finalPath, mapPath }
				}
			}
		}
		return { mShX, mShY, mShN, lastStep, endCircle, finalPath, mapPath }

	}

	pathBuilder = ({ xEnd, yEnd, xStart, yStart }, { mDX, mDY, finalPath, mapPath }) => {



		const pathX = [0];
		const pathY = [0];
		const snakePath = []
		let bPath = 0;
		let xCurRet = xEnd;
		let yCurRet = yEnd;
		let NumbPath = mapPath[yCurRet][xCurRet];
		let NumbReturn;

		while (!(xCurRet === xStart && yCurRet === yStart)) {
			bPath++;
			pathX[bPath - 1] = xCurRet;
			pathY[bPath - 1] = yCurRet;
			snakePath.push({ x: xCurRet, y: yCurRet })
			NumbReturn = (function () {
				if (NumbPath === 1) return 2;
				else if (NumbPath === 2) return 3;
				else if (NumbPath === 3) return 0;
				else if (NumbPath === 4) return 1;
			})();
			const dXRet = mDX[NumbReturn];
			const dYRet = mDY[NumbReturn];
			xCurRet += dXRet;
			yCurRet += dYRet;
			NumbPath = mapPath[yCurRet][xCurRet];
			if (bPath > 500) {
				break;
			}
		}
		finalPath = [...snakePath.reverse()];

		return finalPath
	}


	snakeMapping = (segments, blockSize) => {
		return segments.map((el, i) => {
			const styles = {
				top: `${el.y * blockSize}px`,
				left: `${el.x * blockSize}px`,
			}
			return <div className={`snake`} key={i} style={{ ...this.state.defaultStyles, ...styles }} />
		})
	}



	render() {
		const { cyberSnake, blockSize } = this.props;
		const segments = this.snakeMapping(cyberSnake, blockSize);
		return (
			<>
				<Snake
					style={{ width: `${blockSize}px`, heigth: `${blockSize}px` }}
					segments={segments}
				/>
			</>
		)
	}

}