const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const onePlayerButton = document.getElementById('onePlayerButton');
const onePlayerProButton = document.getElementById('onePlayerProButton');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let vsComputer = false;
let proMode = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (vsComputer && currentPlayer === 'O' && gameActive) {
        if (proMode) {
            handleProComputerTurn();
        } else {
            handleComputerTurn();
        }
    }
};

const handleCellPlayed = (cell, index) => {
    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerText = `${currentPlayer} játékos nyert.`;
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        statusText.innerText = 'A játék döntetlen.';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const handleComputerTurn = () => {
    let availableCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            availableCells.push(i);
        }
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cellIndex = availableCells[randomIndex];
    const cell = document.querySelector(`.cell[data-index='${cellIndex}']`);
    handleCellPlayed(cell, cellIndex);
    handleResultValidation();
};

const handleProComputerTurn = () => {
    const bestMove = getBestMove();
    const cell = document.querySelector(`.cell[data-index='${bestMove}']`);
    handleCellPlayed(cell, bestMove);
    handleResultValidation();
};

const getBestMove = () => {
    let bestValue = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let moveValue = minimax(board, 0, false);
            board[i] = '';

            if (moveValue > bestValue) {
                bestValue = moveValue;
                move = i;
            }
        }
    }
    return move;
};

const minimax = (newBoard, depth, isMaximizing) => {
    let scores = { 'X': -10, 'O': 10, 'tie': 0 };
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestValue = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'O';
                let value = minimax(newBoard, depth + 1, false);
                newBoard[i] = '';
                bestValue = Math.max(value, bestValue);
            }
        }
        return bestValue;
    } else {
        let bestValue = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'X';
                let value = minimax(newBoard, depth + 1, true);
                newBoard[i] = '';
                bestValue = Math.min(value, bestValue);
            }
        }
        return bestValue;
    }
};

const checkWinner = () => {
    for (let [a, b, c] of winningConditions) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (!board.includes('')) {
        return 'tie';
    }
    return null;
};

const handleRestartGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusText.innerText = '';
    cells.forEach(cell => cell.innerText = '');
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame);
twoPlayerButton.addEventListener('click', () => {
    vsComputer = false;
    proMode = false;
    handleRestartGame();
});
onePlayerButton.addEventListener('click', () => {
    vsComputer = true;
    proMode = false;
    handleRestartGame();
});
onePlayerProButton.addEventListener('click', () => {
    vsComputer = true;
    proMode = true;
    handleRestartGame();
});
