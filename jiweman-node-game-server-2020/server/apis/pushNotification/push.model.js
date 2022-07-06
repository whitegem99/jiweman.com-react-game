/*
 * --------------------------------------------------------------------------
 * Created by Barquecon Technologies on 12/03/2019 by Dipak Adsul
 * ---------------------------------------------------------------------------
 */

'use strict';

/*
 * --------------------------------------------------------------------------
 * Include required modules
 * ---------------------------------------------------------------------------
 */

let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    bcrypt = require('bcryptjs');


/*
 * --------------------------------------------------------------------------
 * Save Device token 
 * ---------------------------------------------------------------------------
 */

var UserDeviceSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    deviceId: { type: String, required: true },
    deviceType: { type: String, required: true, enum: ['Android', 'IOS'] },
}, { timestamps: true }, { read: 'secondaryPreferred' });

/*
 * --------------------------------------------------------------------------
 * Paginate the results
 * ---------------------------------------------------------------------------
 */

UserDeviceSchema.plugin(mongoosePaginate);

/*
 * --------------------------------------------------------------------------
 * Export the UserDevice model
 * ---------------------------------------------------------------------------
 */

let UserDevice = mongoose.model('UserDevice', UserDeviceSchema);



module.exports = {
    UserDevice: UserDevice
}