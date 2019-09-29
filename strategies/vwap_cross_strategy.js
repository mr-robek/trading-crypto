const VWAP = require('./movingaverages').VWAP;
const maCrossStrategy = require('./ma_cross_strategy');

module.exports = maCrossStrategy.bind(null, VWAP);
