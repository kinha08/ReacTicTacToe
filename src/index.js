import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Position(props) {
	const current = props.current;
	let pos

	if (current) {
		pos = (<span className="position-selected">
			{props.position}
		</span>)
	} else {
		pos = (<span className="position">
			{props.position}
		</span>)
	}

	return (
		pos		
	);
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
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

    //   <div className="board">
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
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

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

  render() {
		const history = this.state.history;
    const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const moves = history.map((step, move) => {	
				const desc = move ?
				'Go to move #' + move :
				'Go to game Start';
				return (
					<li key={move}>
						<button onClick={() => this.jumpTo(move)}>{desc}</button>
							<Position 
								position={step.currentPlayer + step.location} 
								current={move === this.state.stepNumber}	
							/>
					</li>
				);
		});

		let status
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
		}

    return (
      <div className="game">
        <div className="game-board">
          <Board 
						squares={current.squares}
						onClick={i => this.handleClick(i)}
					/>
        </div>
        <div className="game-info">
          <div>{status}</div>
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
      return squares[a];
    }
  }
  return null;
}
