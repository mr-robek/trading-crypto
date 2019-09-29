const SMA = require('./movingaverages').SMA;
const maCrossStrategy = require('./ma_cross_strategy');

module.exports = maCrossStrategy.bind(null, SMA);
