class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.victories = 0;
        this.defeats = 0;
    }

    updateScore(points) {
        this.score += points;
    }

    addVictory() {
        this.victories++;
    }

    addDefeat() {
        this.defeats++;
    }
}

const statusDisplay = document.querySelector('.status');
let gameActive = true;
let currentPlayer = "X";
let player1 = new Player("Jogador 1");
let player2 = new Player("Jogador 2");
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `${currentPlayer === "X" ? player1.name : player2.name} Ganhou!`;
const drawMessage = () => `Jogo Acabou em Empate!`;
const currentPlayerTurn = () => `É a vez de ${currentPlayer === "X" ? player1.name : player2.name}`;

updateScoreDisplay();

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.reiniciar').addEventListener('click', handleRestartGame);

function startGame() {
    player1.name = document.querySelector('#player1').value || "Jogador 1";
    player2.name = document.querySelector('#player2').value || "Jogador 2";
    statusDisplay.innerHTML = currentPlayerTurn();
    updateScoreDisplay();
    addPlayersToRanking();
}

function addPlayersToRanking() {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    updateRankingTable(player1, ranking);
    updateRankingTable(player2, ranking);
}

function updateRankingTable(player, ranking) {
    let existingPlayer = ranking.find(p => p.name === player.name);
    if (!existingPlayer) {
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
        rankingTable.innerHTML +=  `
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
        currentPlayer === "X" ? player1.addVictory() : player2.addVictory();
        saveToRanking(currentPlayer === "X" ? player1 : player2);
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
    currentPlayer === "X" ? player1.updateScore(1) : player2.updateScore(1);
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.querySelector('#scorePlayer1').innerText = `Jogador 1 (${player1.name})`;
    document.querySelector('#scorePlayer2').innerText = `Jogador 2 (${player2.name})`;
}

function saveToRanking(winner) {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    let winnerInRanking = ranking.find(player => player.name === winner.name);
    if (winnerInRanking) {
        winnerInRanking.victories++;
    } else {
        ranking.push({ name: winner.name, victories: 1, defeats: 0 });
    }
    let loserName = currentPlayer === "X" ? player2.name : player1.name;
    let loserInRanking = ranking.find(player => player.name === loserName);
    if (loserInRanking) {
        loserInRanking.defeats++;
    } else {
        ranking.push({ name: loserName, victories: 0, defeats: 1 });
    }

    localStorage.setItem('ranking', JSON.stringify(ranking));
    renderRankingTable();
}

document.addEventListener('DOMContentLoaded', () => {
    renderRankingTable();
});
