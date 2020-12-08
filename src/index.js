import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	const active = props.active
	let highlight

	if (active) {
		highlight = "square active"
	} else {
		highlight = "square"
	}
  return (
    <button className={highlight} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function ToggleButton(props) {
	return (
		<button className="sort-button" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

function Position(props) {
	const current = props.current;
	let pos
	if (current) {
		pos = "position-selected"
	} else {
		pos = "position"
	}

	return (
		<span className={pos} >
			{props.position}
		</span>	
	);
}

class Board extends React.Component {
  	renderSquare(i) {
		  const winnerPositions = this.props.winnerPositions
		  let win
		  if (winnerPositions && winnerPositions.includes(i)) {
			  win = true 
		  } else {
			  win = false
		  }
		return (
			<Square
			active={win}
			value={this.props.squares[i]}
			onClick={() => this.props.onClick(i)}
			/>
		);
	}

	renderRow(row) {
		//const board = []
		const squares = []
		const offset = row * 3
		for(let i = 0; i < 3 ; i++) {
			squares.push(this.renderSquare(offset + i));
		}

		return (
			<div className="board-row">
				{squares}
			</div>
		);
	}
  	render() {
		const rows = []
		for (let j = 0; j < 3; j++) {
			rows.push(this.renderRow(j));
		}

    return (
			<div className="board">
				{rows}
			</div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
				squares: Array(9).fill(null),
				location: '',
				currentPlayer: '',
				}
			],
			stepNumber: 0,
			xIsNext: true,
			isAscending: true,
		};
	}
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([
				{
					squares: squares,
					location: getLocation(i),
					currentPlayer: squares[i]
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,		
		});
	}

	toggleClick() {
		this.setState({
			isAscending: !this.state.isAscending,
		});

	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

  render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const seqWinner = calculateWinner(current.squares);
		const winner = seqWinner ? current.squares[seqWinner[0]] : null;
		const sortOrder = this.state.isAscending ? "Ascending" : "Descending";
		const moves = history.map((step, move) => {	
				const desc = move ?
				'Go to move #' + move :
				'Go to game Start';
				return (
					<li key={move}>
						{move + 1 + ". "}
						<button onClick={() => this.jumpTo(move)}>{desc}</button>
							<Position 
								position={step.currentPlayer + step.location} 
								current={move === this.state.stepNumber}	
							/>
					</li>
				);
		});

		if (this.state.isAscending) {
			moves.sort()
		} else {
			moves.reverse()
		}

		let status
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
		}

		if (moves.length > 9 && !winner) {
			status = "Draw"
		}

    return (
      <div className="game">
        <div className="game-board">
          <Board
		  		winnerPositions={seqWinner} 
				squares={current.squares}
				onClick={i => this.handleClick(i)}
			/>
        </div>
        <div className="game-info">
          <div>{status}</div>
					<ToggleButton
						value={sortOrder}
						onClick={() => this.toggleClick()}
					/>
          <ol>{moves}</ol>
        </div>
      </div>
	);
	
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function getLocation(pos) {
	const positions = [
		' in Row 1, Col 1',
		' in Row 1, Col 2',
		' in Row 1, Col 3',
		' in Row 2, Col 1',
		' in Row 2, Col 2',
		' in Row 2, Col 3',
		' in Row 3, Col 1',
		' in Row 3, Col 2',
		' in Row 3, Col 3',
	]

	return positions[pos]
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
