const WMA = require('./movingaverages').WMA;
const maCrossStrategy = require('./ma_cross_strategy');

module.exports = maCrossStrategy.bind(null, WMA);
