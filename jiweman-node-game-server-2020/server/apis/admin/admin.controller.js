let func = require('../common/commonfunction');
let sendResponse = require('../common/sendresponse');
let logger = require('../../logger/log');
let Admin = require('./admin.model').Admin;
let Role = require('../playerAuth/player.model').Role;
var randomize = require('randomatic');
var bcrypt = require('bcryptjs');

/*
 * --------------------------------------------------------------------------
 * Admin Registration with Jiweman API start
 * ---------------------------------------------------------------------------
 */
exports.adminRegistrationWithJiweman = async function (req, res, next) {
    let registrationType = req.query.registrationType;
    let adminData = req.body;
    const Adminacc = 'admin';
    adminData.roleName = 'Admin';
    req.check('password', 'Password is required field!').notEmpty();
    req.check('email', 'Email is required field!').notEmpty();

    if (registrationType == 'admin') {
        let errors = await req.validationErrors();
        if (errors) {
            console.log('errors', errors);
            return res.status(400).send({ "message": func.manageValidationMessages(errors), status: false })
        }

        try {
            Role.findOne({
                roleName: adminData.roleName
            }, (err, data) => {
                if (err) {
                    let msg = ""
                    localStorage.send(msg, res);
                } else {
                    const admin = new Admin();

                    admin.userName = adminData.userName,
                        admin.email = adminData.email,
                        admin.password = adminData.password,
                        confirmPassword = adminData.confirmPassword,
                        admin.gender = adminData.gender,
                        admin.roleId = data._id,
                        admin.accountType = Adminacc,
                        admin.countryId = adminData.countryId,
                        admin.socialId = adminData.socialId,
                        admin.deviceToken = adminData.deviceToken,
                        admin.roleName = adminData.roleName;

                    Admin.findOne({
                        email: adminData.email
                    }, (err, docs) => {
                        if (docs) {
                            res.status(400).send({
                                message: "This email id is already registered",
                                status: false
                            });
                        } else {
                            Admin.findOne({
                                userName: adminData.userName
                            }, function (err, docs) {
                                // console.log('docs', docs);
                                if (docs) {
                                    res.status(200).send({
                                        message: "This username is already taken",
                                        status: false
                                    });
                                } else {
                                    if (confirmPassword === adminData.password) {
                                        admin.save().then(function (data, err) {
                                            // console.log(data);
                                            if (err) {
                                                console.log(err)
                                                let msg = "some error occurred"
                                                sendResponse.sendErrorMessage(msg, res);
                                            } else {
                                                res.send({
                                                    status: 200,
                                                    message: "Registered Successfully",
                                                    data: data
                                                })
                                                // sendResponse.sendSuccessData(data, res);
                                            }
                                        });
                                    } else {
                                        return res.status(400).send({ message: "Password and confirm password must be same", status: false });
                                    }

                                }
                            })
                        }
                    })
                }
            })

        } catch (error) {
            console.log(error);
            return res.status(400).send({ "message": "something went wrong", status: false })
        }

    } else {
        return res.status(400).send({ "message": "please enter valid registrationType", status: false })
    }
}

/*
 * --------------------------------------------------------------------------
 * Admin login with Jiweman API start
 * ---------------------------------------------------------------------------
 */
exports.adminLoginwithJiweman = function (req, res) {
    let loginType = req.body.loginType;
    let userName = req.body.userName;
    let password = req.body.password;

    if (loginType == 'adminLogin') {

        if (!userName && !password) {

            return res.status(400).send({ message: "Bad Request", status: false });
        }
        Admin.findOne({
            userName: userName,
        }, '+password', function (err, foundUser) {

            if (err) {
                return res.status(400).send({ message: "Bad Request", status: false });

            } else {
                if (foundUser == null) {
                    logger.info('Please enter valid User id')

                    return res.status(400).send({ message: "Please enter valid User id", status: false });
                }
                foundUser.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        logger.info('Incorrect Credentials');

                        return res.status(400).send({ message: "Incorrect Credentials", status: false });
                    } else {
                        if (!isMatch) {
                            logger.info('Please enter valid Password');

                            return res.status(400).send({ message: "Please enter valid Password", status: false });
                        } else {

                            if (!foundUser.isActive) {

                                return res.status(400).send({ message: "Your account is not activated. Please contact administrator.", status: false });

                            } else {
                                bcrypt.genSalt(10, function (err, salt) {
                                    
                                    bcrypt.hash(password, salt, function (err, hash) {

                                        password = hash;

                                        var token = func.createToken(foundUser);
                                        var data = {};
                                        data._id = foundUser._id;
                                        data.userName = foundUser.userName;
                                        data.email = foundUser.email;
                                        data.password = password;
                                        foundUser.token = token;
                                        foundUser.save().then(function (data, err) {
                                            if (err) {
                                                logger.info('issue in saving token');
                                                return res.status(400).send({ message: "Token issue", status: false })
                                            }
                                            return res.status(200).send({ message: "Data Found", status: true, token, data });
                                        })

                                        //  return res.status(200).send({ message: "Data Found", status: true, token, data });
                                    });
                                });
                            }
                        }
                    }
                })
            }
        });
    } else {
        return res.status(400).send({ message: "Please enter valid login type", status: false });

    }

}

/*
 * ---------------------------------------------------------------------------
 * Admin Forgot Password
 * ---------------------------------------------------------------------------
 */
exports.adminForgotPassword = function (req, res) {
    var email = req.body.email;
    // req.check('email', 'Email is required field!').notEmpty();
    // req.check('email', 'Please enter email in valid format!').isEmail();

    // var errors = req.validationErrors();

    // let errors = await req.validationErrors();
    // if (errors) {
    //     return res.status(400).send({ "message": func.manageValidationMessages(errors), status: false })
    // }

    try {
        Admin.findOne({
            email: email
        }, function (err, foundUser) {
            // console.log(foundUser);
            if (err) {
                logger.error(err.stack);
                return res.status(502).send({ message: 'Unknown Error', status: false });
            } else {
                if (foundUser == null) {
                    logger.info('This email id is not registered');
                    return res.status(200).send({ message: 'This emaid id is not registered', status: false });
                } else {
                    foundUser.resetPassword.initiated = true;
                    foundUser.resetPassword.expiresOn = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
                    foundUser.resetPassword.token = randomize('Aa0', 50);
                    foundUser.save(function (err) {
                        if (err) {
                            logger.error(err.stack);
                            return res.status(502).send({
                                message: 'Unknown Error',
                                status: false,
                                err: err
                            });
                        } else {
                            //send reset password link to user
                            func.sendadminResetPasswordEmail(foundUser.email, foundUser.resetPassword.token)
                            return res.status(200).send({
                                message: 'Reset password link is sent successfully',
                                status: true
                            });
                        }
                    });
                }
            }
        });
    } catch (e) {
        console.log(e.stack);
    }
}

/*
 * ---------------------------------------------------------------------------
 * Admin Reset Password
 * ---------------------------------------------------------------------------
 */
exports.adminResetPassword = function (req, res) {
    var passwordResetData = req.body;
    var token = req.query;
    // console.log(passwordResetData);
    if (!token || !passwordResetData.password) {
        console.log(err)
        let msg = "some error occurred";
        sendResponse.sendErrorMessage(msg, res);
    }
    Admin.findOne({
        'resetPassword.token': token.token,
        'resetPassword.initiated': true
    }, function (err, foundUser) {
        if (err) {
            console.log(err)
            let msg = "some error occurred";
            sendResponse.sendErrorMessage(msg, res);
        } else {
            if (foundUser == null) {
                console.log(err)
                let msg = "some error occurred";
                sendResponse.sendErrorMessage(msg, res);

            } else {
                if (new Date(foundUser.resetPassword.expiresOn) < new Date()) {
                    return res.status(200).send({
                        message: 'Token Expired',
                        status: false
                    });
                }
                foundUser.resetPassword.initiated = false;
                foundUser.resetPassword.token = null;
                foundUser.password = passwordResetData.password;
                foundUser.save(function (err) {
                    if (err) {
                        return res.status(502).send({
                            message: 'Unknow Error',
                            status: false
                        });
                    } else {
                        return res.status(200).send({
                            message: 'Updated',
                            status: true
                        });
                    }
                });
            }
        }
    });

}

/*
 * --------------------------------------------------------------------------
 * edit Admin details
 * ---------------------------------------------------------------------------
 */
exports.editAdmin = function (req, res) {
    func.checkUserAuthentication(req, res, function (payload) {
        let adminId = req.body.adminId;
        let updatedAdmin = req.body;
        if (adminId) {
            Admin.findOneAndUpdate({
                _id: adminId
            }, updatedAdmin, {
                upsert: false,
                new: true,
                useFindAndModify: false
            }, function (err, updated) {
                if (err) {
                    console.log('$$$$$$$$$$$$');
                    console.log(err);
                    let msg = "some error occurred"
                    sendResponse.sendErrorMessage(msg);
                } else {
                    sendResponse.sendSuccessData(updated, res);
                }
            });
        } else {
            let msg = 'Send Admin Id'
            sendResponse.sendErrorMessage(msg, res)
        }
    })
}

/*
 * --------------------------------------------------------------------------
 * Admin logout
 * ---------------------------------------------------------------------------
 */
// exports.logout = (req, res) => {


// }