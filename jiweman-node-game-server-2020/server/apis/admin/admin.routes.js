const express = require('express');
const router = express.Router();

const adminController = require('./admin.controller');

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - register
 *     description: register admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: register
 *         schema:
 *           type: object
 *         required:
 *           - userName
 *           - email
 *           - password
 *           
 *         properties:
 *           userName: string
 *           email: string
 *           password: string
 *           countryId: string
 *           socialId: string
 *           deviceToken: string
 *           gender: string
 *           roleId: string
 *           accountType: string
 *           roleName: string
 *           accountType: string
 *  
 *     responses:
 *       200:
 *         description: Successfully created
 */
// router.post('/register', adminController.adminRegistrationWithJiweman);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - login
 *     description: login admin
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/adminLogin"
 *     responses:
 *       200:
 *         description: Successfully created
 */

router.post('/login', adminController.adminLoginwithJiweman);

/**
 * @swagger
 * /adminForgotpassword:
 *   post:
 *     tags:
 *       - forgot
 *     description: forgot password
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         required:
 *           - email
 *         properties:
 *           email: string
 *         schema:
 *           $ref: "#/definitions/forgot"
 *     responses:
 *       200:
 *         description: Successfully created
 */


router.post('/adminForgotpassword', adminController.adminForgotPassword);

/**
 * @swagger
 * /adminResetPassword:
 *   post:
 *     tags:
 *       - reset
 *     description: reset password
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         required:
 *           - email
 *           - password
 *           - password_conformation
 *         properties:
 *           email: string
 *           password: string
 *           password_conformation: string
 *         schema:
 *           $ref: "#/definitions/forgot"
 *     responses:
 *       200:
 *         description: Successfully created
 */


router.post('/adminResetPassword', adminController.adminResetPassword);

router.post('/editAdmin', adminController.editAdmin);

// router.post('/logout', adminController.logout);
module.exports = router;