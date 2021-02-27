import React from "react";
import css from "./App.module.css";
import Game from "./components/Game";
import MainMenu from "./components/MainMenu.jsx";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: "Versus",
			difficult: "Normal",
			areaSize: "Normal",
			gameStart: false,
			snakeLength:3
		};
	}

	makeChange = ({ type, state }) => {
		this.setState({ [type]: state });
	};



	render() {
		const {gameStart,mode, difficult, areaSize } = this.state;
		return (
			<div className = {css.gameArea}>
					{gameStart ? (
						<>
						<Game makeChange = {this.makeChange} gameMode={{gameStart, mode, difficult, areaSize }} />
						<div className = {css.counter}><span>{`Snake Length: ${this.state.snakeLength}`}</span></div>
						</>
					) : (
						<MainMenu
							makeChange={this.makeChange}
							type={{ mode, difficult, areaSize }}
						/>
					)}
			</div>
		);
	}
}

export default App;
