const socket = io();

// Funzione per aggiornare la lista dei giocatori
function updatePlayerList(players) {
    const playersList = document.getElementById("playersList");
    playersList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = player;
        playersList.appendChild(li);
    });
}

// Funzione per aggiornare lo stato
function updateStatus(playersCount) {
    const statusMessage = document.getElementById("statusMessage");
    if (playersCount === 10) {
        statusMessage.textContent = "Stato: La partita è completa!";
        statusMessage.style.color = '#4A4844';
    } else {
        statusMessage.textContent = `Stato: In attesa di ${10 - playersCount} giocatori...`;
    }
}

// Ricevi l'aggiornamento della lista dei giocatori
socket.on('updatePlayers', (players) => {
    updatePlayerList(players);
    updateStatus(players.length);
});

// Gestisci quando la partita è completa
socket.on('gameFull', (isFull) => {
    if (isFull) {
        document.getElementById("addPlayerButton").disabled = true;
    }
});

// Aggiungi un giocatore quando clicchi il bottone
document.getElementById("addPlayerButton").addEventListener("click", () => {
    const playerName = document.getElementById("playerName").value;
    if (playerName) {
        socket.emit('addPlayer', playerName);
        document.getElementById("playerName").value = '';  // Svuota il campo
    }
});
