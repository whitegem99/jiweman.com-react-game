const { DayContext } = require('twilio/lib/rest/bulkexports/v1/export/day');
const func = require('../common/commonfunction');
const bettingCompany = require('./bettingCompany.model').bettingCompany;
const Admin = require('../admin/admin.model').Admin;
const Role = require('../playerAuth/player.model').Role;
const allowedCountries = require("../common/commonfunction");
let config = require('../../config');
let Player = require("../playerAuth/player.model").Player;


exports.create = async (req, res, next) => {
    try {

        let data = req.body;
        data.status = "Initiated";

        if (!data.name) {
            return res.status(400).send({
                message: 'please send name',
                status: false,
            });
        }

        if (!data.country) {
            return res.status(400).send({
                message: 'please send country',
                status: false,
            });
        }

        if (!data.apiToken) {
            return res.status(400).send({
                message: 'please send api token',
                status: false,
            });
        }

        if (!data.email) {
            return res.status(400).send({
                message: 'please send email',
                status: false,
            });
        }

        if (!data.password) {
            return res.status(400).send({
                message: 'please send password',
                status: false,
            });
        }

        if (!data.confirmPassword) {
            return res.status(400).send({
                message: 'please send confirm password',
                status: false,
            });
        }

        if (data.password !== data.confirmPassword) {
            return res.status(400).send({
                message: 'password and confirm password should be the same',
                status: false,
            });
        }

        let admin = await Admin.findOne({ email: req.body.email });
        console.log(admin)

        if (admin && admin.email) {
            return res.status(400).send({
                message: 'This email is already exists.',
                status: false,
            });
        }

        let obj = new bettingCompany(data);
        let result = await obj.save();
        console.log(result);

        let adminData = {};
        adminData.accountType = 'admin';
        adminData.roleName = 'Admin';
        adminData.email = data.email;
        adminData.userName = data.email;
        adminData.password = data.password;
        adminData.roleName = adminData.roleName;
        adminData.isSuperAdmin = false;
        adminData.isActive = false;
        adminData.bettingCompanyId = result._id;

        const roleData = await Role.findOne({ roleName: adminData.roleName });

        adminData.roleId = roleData._id;

        let adminObj = new Admin(adminData);
        let adminResult = await adminObj.save();

        res.json({
            status: 200,
            message: 'Betting company saved',
            data: result,
        });

    }
    catch (e) {
        return res.status(400).send({
            message: e.message,
            status: false,
        });
    }
}

exports.getAll = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload) => {
        try {

            let result = await bettingCompany.find({}).lean();

            res.json({
                status: 200,
                message: 'Companies fetched',
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


exports.getAllByCountry = async (req, res, next) => {
        try {

            let result = await bettingCompany.find().lean();

            res.json({
                status: 200,
                message: 'Companies fetched',
                data: result,
            });


        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }
    
}

exports.getAllCountries = async (req, res, next) => {
    try {

        let countries = allowedCountries.allowedCountries.map(function (country) {
            return country.name;
        })


        res.json({
            status: 200,
            message: 'Companies fetched',
            data: countries,
        });


    }
    catch (e) {
        return res.status(400).send({
            message: e.message,
            status: false,
        });
    }

}

exports.approve = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload) => {

        try {

            let id = req.body.id;

            if (!id) {
                return res.status(400).send({
                    message: 'please send id',
                    status: false,
                });
            }

            let obj = await bettingCompany.update({ _id: id }, { $set: { status: "Active" } }, { new: true });

            let adminObj = await Admin.update({ bettingCompanyId: id }, { $set: { isActive: true } });
            const webhookRegister = await func.registerWebhookInAccount(obj.apiToken)
            res.json({
                status: 200,
                message: 'Betting company updated',
                data: obj,
            });


        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }

    });

}

exports.deactivate = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload) => {

        try {

            let id = req.body.id;

            if (!id) {
                return res.status(400).send({
                    message: 'please send id',
                    status: false,
                });
            }

            let obj = await bettingCompany.update({ _id: id }, { $set: { status: "Inactive" } }, { new: true });

            let adminObj = await Admin.update({ bettingCompanyId: id }, { $set: { isActive: false } });

            res.json({
                status: 200,
                message: 'Betting company updated',
                data: obj,
            });


        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }

    });

}

exports.activate = async (req, res, next) => {
    func.checkUserAuthentication(req, res, async (payload) => {

        try {

            let id = req.body.id;

            if (!id) {
                return res.status(400).send({
                    message: 'please send id',
                    status: false,
                });
            }

            let obj = await bettingCompany.update({ _id: id }, { $set: { status: "Active" } }, { new: true });

            let adminObj = await Admin.update({ bettingCompanyId: id }, { $set: { isActive: true } });

            res.json({
                status: 200,
                message: 'Betting company updated',
                data: obj,
            });


        }
        catch (e) {
            return res.status(400).send({
                message: e.message,
                status: false,
            });
        }

    });

}


exports.getAllEvent = async (req,res,next)=>{
    func.checkUserAuthentication(req, res, async (payload) => {
        let event = config.REFER_EVENT; 
        res.json({
            status: 200,
            message: 'Fetch Event',
            data: event,
        });    
    
    })

}


exports.updateReferralSetting = async (req,res,next)=>{
    func.checkUserAuthentication(req, res, async (payload) => {
        try{
            var bettingCompanyId = payload.bettingCompanyId; 
        
            let obj = await bettingCompany.update({ _id: bettingCompanyId}, { $set: { referralSetting:req.body.referralSetting } },{new :true});
            res.json({
                status: true,
                message: 'Referal Setting Updated',
                data: obj,
            });

        }
        catch(e){
            return res.status(400).send({
                message: e.message,
                status: false,
            });

        }
    })
   
}

exports.getReferralSetting = async (req,res,next)=>{
    func.checkUserAuthentication(req, res, async (payload) => {
        try{
            var bettingCompanyId = payload.bettingCompanyId; 
        
            let obj = await bettingCompany.findOne({ _id: bettingCompanyId});

            res.json({
                status: true,
                message: 'Referal Setting fetched',
                data: obj,
            });

        }
        catch(e){
            return res.status(400).send({
                message: e.message,
                status: false,
            });

        }
    })
   
}

exports.referralMessage = async(req,res,next)=>{
    func.checkUserAuthentication(req, res, async (payload) => {
        try{
            var bettingCompanyId = payload.bettingCompanyId; 
            let obj = await bettingCompany.findOne({ _id: bettingCompanyId});
            let message=`Use Refer Code ${payload.player.referCode} and `;
            console.log(obj.referralSetting)
            obj.referralSetting.forEach(info=>{
                
                message = message +  `you and your firend will win ${info.amount} ${payload.player.userCurrency} on your ${info.title}`
                console.log(message)    
            })
            console.log(message);
            res.json({
                status: true,
                message: message,
                data: {referralCode:payload.player.referCode},
            });

        }
        catch(e){
            return res.status(400).send({
                message: e.message,
                status: false,
            });

        }
    })

}




exports.getReferralRewardInfo = async (req,res,next)=>{

    let referCode = req.query.referCode;
    if(_.isEmpty(referCode)){
        return res.status(400).send({
            message: "invalid referal code",
            status: false,
        });
    }

    var getPlayerInfo = await Player.findOne({referCode:referCode}).populate('bettingCompanyId').lean();
console.log(getPlayerInfo);
    if(getPlayerInfo &&getPlayerInfo.referCode == referCode ){

        if(getPlayerInfo.bettingCompanyId && getPlayerInfo.bettingCompanyId.referralSetting){
            let message = ''
            getPlayerInfo.bettingCompanyId.referralSetting.forEach(info=>{
                
                message = message +  `You and your firend will win ${info.amount} ${getPlayerInfo.userCurrency} on your ${info.title}`
                console.log(message)    
            })

            res.json({
                status: true,
                message:message 
            });    
        }
        else{
            return res.status(400).send({
                message: "invalid referal code/ something went wrong",
                status: false,
            });
                
        }
    }




}


exports.referralC