const EMA = require('./movingaverages').EMA;
const maCrossStrategy = require('./ma_cross_strategy');

module.exports = maCrossStrategy.bind(null, EMA);
