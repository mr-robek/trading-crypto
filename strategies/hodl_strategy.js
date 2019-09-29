const ChartDataset = require('../chart').ChartDataset;

module.exports = trainData => {
    var chartDataset = new ChartDataset(1, "HODL");

    const fillChartDataset = dataset => dataset.forEach(data => chartDataset.push(data.time_close, [data.close]));

    fillChartDataset(trainData);

    return function(validationData, wallet) {

        fillChartDataset(validationData);

        if (wallet.getTickerBalance("USD") <= 1.0)
            return;
        var data = validationData[0];
        var tx=wallet.createTransaction(data.ticker, wallet.getTickerBalance("USD")/data.close, "USD", wallet.getTickerBalance("USD"), new Date(data.time_close));
        wallet.processTransactions(tx);
        return chartDataset;
    }
}
