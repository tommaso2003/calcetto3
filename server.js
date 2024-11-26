const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];

app.use(express.static('public'));  // Serve i file statici dalla cartella "public"

io.on('connection', (socket) => {
    console.log('Un nuovo giocatore si è connesso!');

    // Invia la lista dei giocatori al nuovo client
    socket.emit('updatePlayers', players);

    // Quando un giocatore si aggiunge
    socket.on('addPlayer', (playerName) => {
        if (playerName && players.length < 10) {
            players.push(playerName);
            io.emit('updatePlayers', players);  // Invia la lista aggiornata a tutti i client

            if (players.length === 10) {
                io.emit('gameFull', true);  // Notifica che la partita è completa
            }
        }
    });

    // Quando un giocatore si disconnette
    socket.on('disconnect', () => {
        console.log('Un giocatore si è disconnesso!');
        players = players.filter(player => player !== socket.name);
        io.emit('updatePlayers', players);  // Invia la lista aggiornata
    });
});

server.listen(3000, () => {
    console.log('Server avviato su http://localhost:3000');
});
