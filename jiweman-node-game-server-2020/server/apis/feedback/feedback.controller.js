const func = require('../common/commonfunction');
const feedback = require('./feedback.model').feedback;


exports.create = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload) => {
        try {

            let data = req.body;
            data.userId = payload.sub;
            data.messages = [{ message: data.message, time: new Date(), from: "Player" }];
            data.status = "Initiated";
            

            if (!data.message) {
                return res.status(400).send({
                    message: 'please send message',
                    status: false,
                });
            }

            let obj = new feedback(data);
            obj.save(function (err, result) {
                console.log(result)
                console.log(err);
                res.json({
                    status: 200,
                    message: 'Feedback saved',
                    data: result,
                });
            })
        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }
    })
}

exports.replyToFeedback = async (req, res, next) => {

    func.checkUserAuthentication(req, res, async (payload) => {
        try {

            let data = req.body;
            let message = [{ message: data.message, time: new Date(), from: "Player" }];
            
            if (!message) {
                return res.status(400).send({
                    message: 'please send message',
                    status: false,
                });
            }

            let id = req.params.feedbackId;
            feedback.findByIdAndUpdate({_id:id},{$push:{messages:message},$set:{status:"Active"}},{new:true},(err,updated)=>{
                res.json({
                    status: 200,
                    message: 'Replied to feedback',
                    data: updated,
                  });
            })

        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }
    })
}

exports.closeFeedback = async (req, res, next) => {

    func.checkUserAuthentication(req, res, async (payload) => {
        try {

            let data = req.body;
            let message = [{ message: data.message, time: new Date(), from: "Admin" }];
            let status = data.isClose? "Closed" : "Active";
            
            if (!message) {
                return res.status(400).send({
                    message: 'please send message',
                    status: false,
                });
            }

            let id = req.params.feedbackId;
            feedback.update({_id:id},{$push:{messages:message},$set:{status:status}},{new:true},(err,updated)=>{
                res.json({
                    status: 200,
                    message: 'Replied to feedback',
                    data: updated,
                  });
            })

        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }
    })
}

exports.getAll = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload) => {
        try {

            let query = {}

            if (!payload.admin.isSuperAdmin) {
                query.bettingCompanyId = payload.admin.bettingCompanyId
            }
            let result = await feedback.find(query).lean();

            res.json({
                status: 200,
                message: 'Feedback fetched',
                data: result,
            });

            
        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }
    })
}

exports.getAllByUserId = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload) => {
        try {

            let userId = payload.sub;;

            let result = await feedback.find({userId:userId}).lean();

            res.json({
                status: 200,
                message: 'Feedback fetched',
                data: result,
            });

            
        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }
    })
}

