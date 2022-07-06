/*
* --------------------------------------------------------------------------
* Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
* ---------------------------------------------------------------------------
*/

let func = require('../common/commonfunction');
let matchPlayController = require('../matchPlay/Match.controller');
let playWithFriendsController = require('../playWithFriends/playwithfriends.controller');
let playerController = require('../player/player.controller');
/*
* --------------------------------------------------------------------------
* Socket Connection and room creation  function 
* ---------------------------------------------------------------------------
*/
var sockets = {};
var usernames = {};

var watingPlayers = [];
var watingPlayersForRematch = [];
var watingPlayersForPlayWithFriends = [];
var waitingPlayersForLeagueGamePlay = [];
var activeRooms = [];
// var lastPosition;
var msgString;

var rooms = ['Lobby'];
sockets.init = function (server) {
    // socket.io setup
    console.log('Socket initialised')
    var io = require('socket.io').listen(server, {'pingInterval': 1000, 'pingTimeout': 5000});
    
    //var io = require('socket.io').listen(server, {
    //    'heartbeat interval': 5,
    //    'heartbeat timeout': 10
    //});

    io.sockets.on('connection', function (socket) {
        console.log('socket connected');
        // clients  = io.engine.clientsCount
        // io.emit('showOnlineClients', clients-1);
        
        
        // other logic

        // This is one to one chat
        socket.on('adduser', function (username) {
            socket.username = username;
            socket.room = 'Lobby';
            usernames[username] = username;
            socket.join('Lobby');
            console.log('user added')
            socket.emit('updateChat', 'SERVER:you have connected to Lobby', 'you have connected to Lobby');
            socket.broadcast.to('Lobby').emit('updateChat', 'SERVER:' + username + ' has connected to this room');
            socket.emit('updaterooms', rooms, 'Lobby');
        });

        socket.on('create', function (room) {
            var index = rooms.indexOf(room);
            if (index > -1) {
                rooms.push(room);
            }
            socket.emit('updaterooms', rooms);
        });

        socket.on('sendChat', function (data) {
            socket.broadcast.to(data.room).emit('updateChat', data);
        });

        /*
        * --------------------------------------------------------------------------
        * Socket SwitchRoom  function 
        * ---------------------------------------------------------------------------
        */


        socket.on('switchRoom', function (newroom) {
            var oldroom;
            oldroom = socket.room;
            if(oldroom != newroom){
                socket.leave(socket.room);
                socket.join(newroom);
                socket.emit('updateChat', 'SERVER: you have connected to ' + newroom, 'you have connected to ' + newroom);
                socket.broadcast.to(oldroom).emit('updateChat', 'User left', socket + ' has left this room');
                socket.room = newroom;
                // io.sockets.in(newroom).emit('updateChat', 'connected', lastPosition);
                socket.broadcast.to(newroom).emit('updateChat', 'connected', socket.username);
                socket.emit('updaterooms', rooms, newroom);
            } else {
                socket.join(newroom);
                io.sockets.to(newroom).emit('updateChat', 'connected', socket.username);
            }

        });

        /*
        * --------------------------------------------------------------------------
        * Socket Disconnect function 
        * ---------------------------------------------------------------------------
        */

        socket.on('disconnect', function () {
            console.log("Socket Disconnected");
            // clients  = io.engine.clientsCount
            // io.emit('showOnlineClients', clients-1);
            // socket.broadcast.in(socket.room).emit('opponentLeft', socket.username);
            // socket.broadcast.to(data.room).emit('gameEnd', updateData);
            //socket.emit()
            // remove disconnected user from waiting users pool
            console.log(socket.room);
            
            socket.broadcast.to(socket.room).emit('updateChat', 'disconnected');

            for (var i = 0, len = watingPlayers.length; i < len; i++) {
                if (socket.room == watingPlayers[i].username) {
                    watingPlayers.splice(i, 1);
                }

            }

            // remove disconnected user from rematch waiting users pool
            for (var i = 0, len = watingPlayersForRematch.length; i < len; i++) {
                if (socket.room == watingPlayersForRematch[i].username) {
                    watingPlayersForRematch.splice(i, 1);
                }

            }

            // remove disconnected user from playwithfriends waiting users pool
            for (var i = 0, len = watingPlayersForPlayWithFriends.length; i < len; i++) {
                if (socket.room == watingPlayersForPlayWithFriends[i].username) {
                    watingPlayersForPlayWithFriends.splice(i, 1);
                }

            }

            // remove disconnected user from waitingPlayersForLeagueGamePlay waiting users pool
            for (var i = 0, len = waitingPlayersForLeagueGamePlay.length; i < len; i++) {
                if (socket.room == waitingPlayersForLeagueGamePlay[i].username) {
                    waitingPlayersForLeagueGamePlay.splice(i, 1);
                }

            }

            // remove incative room from rooms array
            var index = rooms.indexOf(socket.username);
            if (index > -1) {
                rooms.splice(index, 1);
            }
            //delete usernames[socket.username];
            // io.sockets.emit('updateusers', usernames);
            // socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected');
            //socket.leave(socket.room);
        });

        // one to one chat ends here


        /*
       * --------------------------------------------------------------------------
       * player left event Start
       * ---------------------------------------------------------------------------
       */

        socket.on('playerLeft', function () {
            console.log("playerLeft");

            // socket.broadcast.in(socket.room).emit('opponentLeft', socket.username);

            // remove disconnected user from waiting users pool
            console.log(socket.room);
            for (var i = 0, len = watingPlayers.length; i < len; i++) {
                if (socket.room == watingPlayers[i].username) {
                    watingPlayers.splice(i, 1);
                }
            }
             // remove disconnected user from rematch waiting users pool
            for (var i = 0, len = watingPlayersForRematch.length; i < len; i++) {
                if (socket.room == watingPlayersForRematch[i].username) {
                    watingPlayersForRematch.splice(i, 1);
                }

            }

            // remove disconnected user from playwithfriends waiting users pool
            for (var i = 0, len = watingPlayersForPlayWithFriends.length; i < len; i++) {
                if (socket.room == watingPlayersForPlayWithFriends[i].username) {
                    watingPlayersForPlayWithFriends.splice(i, 1);
                }

            }

            // remove disconnected user from waitingPlayersForLeagueGamePlay waiting users pool
            for (var i = 0, len = waitingPlayersForLeagueGamePlay.length; i < len; i++) {
                if (socket.room == waitingPlayersForLeagueGamePlay[i].username) {
                    waitingPlayersForLeagueGamePlay.splice(i, 1);
                }

            }
            // remove incative room from rooms array
            var index = rooms.indexOf(socket.username);
            if (index > -1) {
                rooms.splice(index, 1);
            }
            delete usernames[socket.username];
            // io.sockets.emit('updateusers', usernames);
            // socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected');
            socket.leave(socket.room);

        })


        /*
        * --------------------------------------------------------------------------
        * Join Room
        * ---------------------------------------------------------------------------
        */

        function joinRoom(newroom) {
            var oldroom;
            oldroom = socket.room;
            socket.leave(socket.room);
            socket.join(newroom);
            socket.emit('updateChat', 'SERVER: you have connected to ' + newroom, 'you have connected to ' + newroom);
            // socket.broadcast.to(oldroom).emit('updateChat', 'SERVER', socket + ' has left this room');
            socket.room = newroom;
            socket.broadcast.to(newroom).emit('updateChat', 'SERVER', socket + ' has joined this room');
            socket.emit('updaterooms', rooms, newroom);
        }

        /*
        * --------------------------------------------------------------------------
        * Create new Room
        * ---------------------------------------------------------------------------
        */

        function createRoom(room) {
            rooms.push(room);
            socket.emit('updaterooms', rooms);
        }


        /*
        * --------------------------------------------------------------------------
        * Match Making
        * ---------------------------------------------------------------------------
        */
        socket.on('matchmaking', async function (player) {
            if (typeof player == 'string') {
                player = JSON.parse(player);
            }

            waitingPlayersForLeagueGamePlay

            if( player.gameType == 'leagueGamePlay' ) {
                if (waitingPlayersForLeagueGamePlay.length > 0) {
                    for (var i = 0, len = waitingPlayersForLeagueGamePlay.length; i < len; i++) {
                        if (waitingPlayersForLeagueGamePlay[i]['gameType'] == player.gameType && waitingPlayersForLeagueGamePlay[i]['username'] != player.username && waitingPlayersForLeagueGamePlay[i]['leagueId'] === player.leagueId) {
                            console.log(player)
                            joinRoom(waitingPlayersForLeagueGamePlay[i].username);
                            tempR = waitingPlayersForLeagueGamePlay[i].username;
                            let newMatchData;
    
                            newMatchData = {
                                'playerOneUserName': waitingPlayersForLeagueGamePlay[i]['username'],
                                'playerTwoUserName': player.username,
                                'matchType': 'leagueGamePlay',
                                'roomName': waitingPlayersForLeagueGamePlay[i].username,
                                'isRematch': false,
                                'leagueId': player.leagueId
                            }
                            let matchData = await matchPlayController.createNewMatch(newMatchData);
                            io.sockets.in(matchData.roomName).emit('matchfound', matchData);
                            setTimeout(gameEnd, 20000, matchData);
                            waitingPlayersForLeagueGamePlay.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    waitingPlayersForLeagueGamePlay.push(player);
                    createRoom(player.username);
                    joinRoom(player.username);
                    io.sockets.in(player.username).emit('noMatchFound', {
                        message: 'Currently No Players are online'
                    });
                }

            } else if( player.gameType == 'playWithFriends' ) {
                if (watingPlayersForPlayWithFriends.length > 0) {
                    for (var i = 0, len = watingPlayersForPlayWithFriends.length; i < len; i++) {
                        let matchMaikingResponse = await playWithFriendsController.playWithFriendsMatchMaking(player, watingPlayersForPlayWithFriends[i]);
                        if ( matchMaikingResponse ) {
                            newMatchData = {
                                'playerOneUserName': watingPlayersForPlayWithFriends[i]['username'],
                                'playerTwoUserName': player.username,
                                'matchType': 'playWithFriends',
                                'roomName': watingPlayersForPlayWithFriends[i].username,
                                'isRematch': false
                            }
                            joinRoom(watingPlayersForPlayWithFriends[i].username);
                            let matchData = await matchPlayController.createNewMatch(newMatchData);
                            await playWithFriendsController.removeFromTempPlayWithFriends(player, watingPlayersForPlayWithFriends[i]);
                            io.sockets.in(matchData.roomName).emit('matchfound', matchData);
                            watingPlayersForPlayWithFriends.splice(i, 1);
                            break;
                        } else {
                            watingPlayersForPlayWithFriends.push(player);
                            createRoom(player.username);
                            joinRoom(player.username);
                            io.sockets.in(player.username).emit('noMatchFound', {
                                message: 'Currently No Players are online'
                            });
                        }
                    }

                } else {
                    watingPlayersForPlayWithFriends.push(player);
                    createRoom(player.username);
                    joinRoom(player.username);
                    io.sockets.in(player.username).emit('noMatchFound', {
                        message: 'Currently No Players are online'
                    });
                }

            } else {
                socket.username = player.username;
                if (typeof player == 'string') {
                    player = JSON.parse(player);
                }
                if (watingPlayers.length > 0) {
                    for (var i = 0, len = watingPlayers.length; i < len; i++) {
                        if (watingPlayers[i]['gameType'] == player.gameType && watingPlayers[i]['username'] != player.username) {
                            joinRoom(watingPlayers[i].username);
                            tempR = watingPlayers[i].username;
                            let newMatchData;
    
                            newMatchData = {
                                'playerOneUserName': watingPlayers[i]['username'],
                                'playerTwoUserName': player.username,
                                'matchType': 'oneonone',
                                'roomName': watingPlayers[i].username,
                                'isRematch': false
                            }
                            let matchData = await matchPlayController.createNewMatch(newMatchData);
                            io.sockets.in(matchData.roomName).emit('matchfound', matchData);
                            setTimeout(gameEnd, 20000, matchData);
                            watingPlayers.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    watingPlayers.push(player);
                    createRoom(player.username);
                    joinRoom(player.username);
                    io.sockets.in(player.username).emit('noMatchFound', {
                        message: 'Currently No Players are online'
                    });
                }
            }
        });

        function gameEnd(data) {
            io.sockets.in(data.roomName).emit('MatchStarted', data);
        }
        
        /**
         * Handle the turn played by either player and notify the other. 
         */
        socket.on('startTurn', async function (data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            socket.broadcast.to(data.room).emit('turnPlaying', data);
        });
        
        /**
         * Handle the turn played by either player and notify the other.
         */
        socket.on('endTurn', async function (data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            // msgString = data.message;
            // var format = /[$]/;
           
            // if(format.test(msgString)){
            //     lastPosition = msgString;
            //     // console.log('lastPosition',lastPosition);
            // } else {
            //     console.log('lastposition not found');
            //     // return
            // }
            socket.broadcast.to(data.roomName).emit('turnPlayed', data);
        });


        /**
         * Handle the turn played by either player and notify the other. 
         */
        socket.on('getChangeFormation', async function (data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            io.sockets.in(data.roomName).emit('changedFormation', data);
        });

        /**
         * display online players 
         */
        socket.on('getOnlinePlayers', async function () {
            var clients  = io.engine.clientsCount - 1
            io.emit('showOnlineClients', clients);
        })

        /**
         * display connected players in room
         */
        socket.on('connectedToRoom', async function (room) {
	        io.of('/').in(room).clients(function(error,clients){
            var numClients=clients.length;
            io.sockets.in(room).emit('myStatus', numClients);
          });
        });

        /**
         * Notify the players about the victor.
         */
        socket.on('gameEnded', async function (data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            const winnerName = data.winnerName;
            const playerOneGoal = data.playerOneGoal;
            const playerTwoGoal = data.playerTwoGoal;
            const roomName = data.roomName;
            const playerOneUserName = data.playerOneUserName;
            const playerTwoUserName = data.playerTwoUserName;
            const matchType = data.matchType;
            const matchId = data.matchId;
            const leagueId = data.leagueId;

            const winLoseData = {
                winnerName: winnerName,
                playerOneUserName:playerOneUserName,
                playerTwoUserName:playerTwoUserName,
                playerOneGoal: playerOneGoal,
                playerTwoGoal: playerTwoGoal,
                roomName: roomName,
                matchType: matchType,
                matchId:matchId,
                leagueId:leagueId
            }
            const updateData = await func.updateMatchResults(winLoseData);
            const updateLeaderBoard = await playerController.updatePlayerLeaderBoardData(winLoseData);
            io.sockets.in(data.roomName).emit('gameEnd', data);
            console.log('data',data);
        });
        
        socket.on('getMatchStatus', async function (data) {
            if (typeof data == 'string') {
                data = JSON.parse(data)
            }
            const matchId = data.matchId;
            const matchStatusResult = await func.getMatchStatusResult(matchId);
            console.log('matchStatusResult',matchStatusResult);
            io.to(socket.id).emit('matchStatus', matchStatusResult);
        });

        socket.on('rematch', async function (data) {
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }

            console.log('this is rematch');
            socket.username = data.username;
            socket.message = data.message;

            console.log(watingPlayersForRematch);

            if (watingPlayersForRematch.length > 0) {
                if (data.message == 'RematchDecline') {
                    io.sockets.in(data.roomName).emit('rematchRequest', data);
                } else if (data.message == 'RematchOneNOne') {
                    for (var i = 0, len = watingPlayersForRematch.length; i < len; i++) {
                        if (watingPlayersForRematch[i]['username'] != data.username && watingPlayersForRematch[i]['roomName'] == data.roomName) {
                            if (data.username == data.roomName) {
                                joinRoom(watingPlayersForRematch[i].username);
                            }
                            tempR = watingPlayersForRematch[i].username;
                            let newMatchData;

                            newMatchData = {
                                'playerOneUserName': watingPlayersForRematch[i]['username'],
                                'playerTwoUserName': data.username,
                                'matchType': 'oneonone',
                                'roomName': watingPlayersForRematch[i].username,
                                'isRematch': true
                            }

                            let matchData = await matchPlayController.createNewMatch(newMatchData);
                            console.log('reposnse');
                            console.log(matchData);
                            io.sockets.in(matchData.roomName).emit('matchfound', matchData);
                            watingPlayersForRematch.splice(i, 1);

                            break;
                        }
                    }
                }
            }
            // else if (data.message == 'RematchDecline') {
            //     io.sockets.in(data.roomName).emit('rematchRequest', data, socket.username + 'has left');
            // }
            else {
                console.log('you are first to request');
                io.sockets.in(data.roomName).emit('rematchRequest', data);
                watingPlayersForRematch.push(data);
                if (data.username != data.roomName) {
                    socket.leave(data.roomName);
                    createRoom(data.username);
                    joinRoom(data.username);
                }
                //socket.leave(data.roomName);
                //createRoom( data.username );
                //joinRoom( data.username );
                // io.sockets.in(data.roomName).emit('rematchRequest', data);
                //socket.leave(socket.room);
            }

            // io.sockets.in(data.roomName).emit('rematchRequest', data );
        });

        socket.on('rematchStatus', async function (data) {
            const rematchData = await func.rematch(data);
            console.log('rematch started')
            io.sockets.in(watingPlayers[i].username).emit('matchfound', rematchData);
        });

        socket.on('getActiveClients', async function (data) {
            //console.log(io.sockets.clients());
            console.log('getActiveClients');
            console.log('Active rooms -----:')
            console.log(rooms);
            console.log('active room ends here');
            console.log(rooms);

            console.log('player waiting pool');
            console.log(watingPlayers);
            console.log('player waiting pool ends here');
            console.log(watingPlayers);

        });

    });



}

module.exports = sockets;
