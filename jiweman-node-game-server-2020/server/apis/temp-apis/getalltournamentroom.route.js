
const express = require('express');
const router = express.Router();


const tournamentRoomController = require('./getalltournamentroom.controller');
/**
 * @swagger
 * /8PlayerTournament/getAllTournamentRoom:
 *   get:
 *     tags:
 *       - 8PlayerTournament
 *     security:
 *       - bearer: []
 *     description: getAllTournamentRoom
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.get('/getAllTournamentRoom', tournamentRoomController.getAllTournamentRoom);