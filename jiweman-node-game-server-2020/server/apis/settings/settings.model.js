var mongoose = require('mongoose');
Schema = mongoose.Schema;

var CounterSchema = Schema({
  name: { type: String, required: true },
  value: { type: Number, default: 1 },
});

const AppVersionSchema = Schema(
  {
    appLink: { type: String, required: true },
    appVersion: { type: Number, required: true },
    supportedVersion: { type: Number, required: true },
  },
  { timestamps: true }
);

Counter = mongoose.model('counter', CounterSchema);
const AppVersion = mongoose.model('AppVersion', AppVersionSchema);

module.exports = {
  Counter: Counter,
  AppVersion,
};
