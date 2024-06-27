const statusDisplay = document.querySelector('.status');
let gameActive = true;
let currentPlayer = "X";
let player1Name = "";
let player2Name = "";
let player1Score = localStorage.getItem('player1Score') ? parseInt(localStorage.getItem('player1Score')) : 0;
let player2Score = localStorage.getItem('player2Score') ? parseInt(localStorage.getItem('player2Score')) : 0;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `${currentPlayer === "X" ? player1Name : player2Name} Ganhou!`;
const drawMessage = () => `Jogo Acabou em Empate!`;
const currentPlayerTurn = () => `É a vez de ${currentPlayer === "X" ? player1Name : player2Name}`;

updateScoreDisplay();

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.reiniciar').addEventListener('click', handleRestartGame);

function startGame() {
    player1Name = document.querySelector('#player1').value || "Jogador 1";
    player2Name = document.querySelector('#player2').value || "Jogador 2";
    statusDisplay.innerHTML = currentPlayerTurn();
    updateScoreDisplay();
    addPlayersToRanking();
}

function addPlayersToRanking() {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    updateRankingTable(player1Name, ranking);
    updateRankingTable(player2Name, ranking);
}

function updateRankingTable(playerName, ranking) {
    let player = ranking.find(p => p.name === playerName);
    if (!player) {
        player = { name: playerName, victories: 0, defeats: 0 };
        ranking.push(player);
    }
    localStorage.setItem('ranking', JSON.stringify(ranking));
    renderRankingTable();
}

function renderRankingTable() {
    const rankingTable = document.querySelector('#rankingTable tbody');
    rankingTable.innerHTML = '';
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.forEach((player, index) => {
        rankingTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.victories}</td>
                <td>${player.defeats}</td>
            </tr>
        `;
    });
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

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

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        updateScore();
        saveToRanking(currentPlayer === "X" ? player1Name : player2Name);
        gameActive = false;
        return;
    }
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }
    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

function updateScore() {
    if (currentPlayer === "X") {
        player1Score++;
        localStorage.setItem('player1Score', player1Score);
    } else {
        player2Score++;
        localStorage.setItem('player2Score', player2Score);
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.querySelector('#scorePlayer1').innerText = `Jogador 1 (${player1Name}): ${player1Score}`;
    document.querySelector('#scorePlayer2').innerText = `Jogador 2 (${player2Name}): ${player2Score}`;
}

function saveToRanking(winnerName) {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    let winner = ranking.find(player => player.name === winnerName);
    let loser = ranking.find(player => player.name !== winnerName && (player.name === player1Name || player.name === player2Name));
    if (winner) {
        winner.victories++;
    }
    if (loser) {
        loser.defeats++;
    }
    localStorage.setItem('ranking', JSON.stringify(ranking));
    renderRankingTable();
}

document.addEventListener('DOMContentLoaded', () => {
    renderRankingTable();
});
