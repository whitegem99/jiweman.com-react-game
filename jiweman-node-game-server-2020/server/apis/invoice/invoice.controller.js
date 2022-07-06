const func = require('../common/commonfunction');
const { invoice } = require('../invoice/invoice.model');


exports.getAll = async (req, res, next) => {

    func.checkUserAuthentication(req, res, async (payload) => {
        try {

            let query = {}

            if (!payload.admin.isSuperAdmin) {
                query.bettingCompanyId = payload.admin.bettingCompanyId
                query.status = { $ne: "Generated" }
            }

            let result = await invoice.find(query).lean();

            res.json({
                status: 200,
                message: 'Invoices fetched',
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