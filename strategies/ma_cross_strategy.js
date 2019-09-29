// 55 and 200 are specifically used in conjuction for golden and death crosses.
const ChartDataset = require('../chart').ChartDataset;
const SHORT_LEN=9;
const LONG_LEN=21;

module.exports = (MA,trainData, shortLong) => {

    var shortMovingAverage = new MA(shortLong[0]);
    var longMovingAverage = new MA(shortLong[1]);

    const onData = data => {
        shortMovingAverage.push(data.close, data.volume);
        longMovingAverage.push(data.close, data.volume);
    };

    const getSignal = () => shortMovingAverage.value  > longMovingAverage.value ? "BUY" : shortMovingAverage.value < longMovingAverage.value ? "SELL" : "HOLD";

    var chartDataset = new ChartDataset(3, `${trainData[0].ticker} - ${MA.name}(${shortLong})`);

    trainData.forEach(function(data) {
        onData(data);
        chartDataset.push(data.time_close, [data.close, undefined, undefined]);
    });

    return function(validationData, wallet) {
        var previousSignal = getSignal();
        for (var data of validationData) {
            onData(data);
            var signal = getSignal();

            chartDataset.push(data.time_close, [data.close, shortMovingAverage.value, longMovingAverage.value]);
            if (previousSignal !== signal) {
                //console.log(`Signal changed from ${previousSignal} to ${signal} on ${data.time_close}`);
                //console.log("Wallet state:", wallet.balance);
                ;
            }
            previousSignal = signal;

            // perform buy if we have USD available (more than 1 usd)
            if (signal === "BUY" && wallet.getTickerBalance("USD") > 1.0) {
                var tx=wallet.createTransaction(data.ticker, wallet.getTickerBalance("USD")/data.close, "USD", wallet.getTickerBalance("USD"), new Date(data.time_close));
                wallet.processTransactions(tx);
            }
            // perform sell if we have CRYPTO available (its value is more than 1 usd)
            else if (signal === "SELL" && wallet.getTickerBalance(data.ticker)*data.close > 1.0) {
                var tx = wallet.createTransaction("USD", wallet.getTickerBalance(data.ticker)*data.close, data.ticker, wallet.getTickerBalance(data.ticker), new Date(data.time_close));
                wallet.processTransactions(tx)
            } else if ( signal === "HOLD" ){
                // statistical puprose only
                console.log(`${MA.name} shortMovingAverage and longMovingAverage are equal (${longMovingAverage.value}) for data ${data.ticker}`);
            }
        }
        return chartDataset;
    }
}
