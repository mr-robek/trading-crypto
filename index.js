const Wallet = require('./wallet.js');

const createWallet = () => new Wallet({USD:1000});

const testStrategiesForCoin = conf => {
    var dataset = require(`./data/${conf.filename}.json`)
    dataset = dataset.filter(data => data.volume);
    dataset.forEach(data => data.ticker = conf.ticker);
    var trainingSet = dataset.slice(0,250);
    var validationSet = dataset.slice(250);

    STRATEGIES.forEach(strategy => {
        if (strategy === 'hodl_strategy') {
            var wallet = createWallet();
            var chartDataset = require(`./strategies/${strategy}`)(trainingSet)(validationSet, wallet);
            // console.log(`${conf.ticker.toUpperCase()} ${strategy.toUpperCase()} RESULTS:\n`);
            wallet.print(validationSet[validationSet.length-1]);
        } else {
            SHORT_LONG_RANGES.forEach(shortLong => {
                var wallet = createWallet();
                var chartDataset = require(`./strategies/${strategy}`)(trainingSet, shortLong)(validationSet, wallet);
                chartDatasets.push(chartDataset);
                console.log(`${conf.ticker.toUpperCase()} ${strategy.toUpperCase()} ${shortLong} RESULTS:\n`);
                wallet.print(validationSet[validationSet.length-1]);
            })
        }
    })
    console.log();
}
var chartDatasets = [];
const STRATEGIES = [
    'hodl_strategy',
    'sma_cross_strategy',
    'ema_cross_strategy',
    'wma_cross_strategy',
    'vwap_cross_strategy'
];
const SHORT_LONG_RANGES = [
    // [8,13],
    // [8,21],
    // [8,55],
    // [8,200],
    [13,21],
    // [13,55],
    // [13,200],
    // [21,55],
    // [21,200],
    // [55,200]
]
const DATASETS = [
    {ticker:'btc', filename:'btc-bitcoin-2013-2019-ohlcv'},
    {ticker:'eth', filename:'eth-ethereum-2015-2019-ohlcv'},
    {ticker:'ltc', filename:'ltc-litecoin-2013-2019-ohlcv'}
];
DATASETS.forEach(testStrategiesForCoin);

//require("./chart").show(chartDatasets)
