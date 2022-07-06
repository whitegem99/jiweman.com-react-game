'use strict';

/*
 * --------------------------------------------------------------------------
 * Include required modules
 * ---------------------------------------------------------------------------
 */
const mongoosePaginate = require('mongoose-paginate');
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FeedbackSchema = new Schema(
  {
    userId: { type: String, required: true },
    messages: {
        type: [
            {
                message: String,
                time: String,
                from: {
                    type: String,
                    required: true,
                    enum: ['Player','Admin'],
                }
            }
        ], 
        required: false, 
        default:[]
    },
    status: {
        type: String,
        required: true,
        enum: ['Initiated','Active', 'Closed'],
    }
  },
  { timestamps: true }
);

FeedbackSchema.plugin(mongoosePaginate);

let feedback = mongoose.model('feedback', FeedbackSchema);

module.exports = {
    feedback: feedback,
};
