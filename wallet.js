var table = require("table").table;
class Transaction {
    constructor(buyticker, buyamount, sellticker, sellamount, date) {
        this.buyticker = buyticker;
        this.buyamount = buyamount
        this.sellticker = sellticker
        this.sellamount = sellamount
        this.price = `${buyamount/sellamount} ${buyticker}`
        this.iprice = `${sellamount/buyamount} ${sellticker}`
        this.date = date
    }
    static header() {
        return ['Date', 'Buy Ticker', 'Buy Amount', 'Sell Ticker', 'Sell Amount', 'Price', 'Inverted Price'];
    }
}

class Wallet {
    constructor(initialBalance = {}) {
        this.balance  = initialBalance;
        this.transactions = [];
    }
    processTransactions(transaction) {
        var sellTickerBalance = this.balance[transaction.sellticker];
        if (!sellTickerBalance || sellTickerBalance < transaction.sellamount)
            throw new Error(`Insufficient ${transaction.sellticker} balance: ${sellTickerBalance}`);
        this.balance[transaction.sellticker] = sellTickerBalance - transaction.sellamount;
        this.balance[transaction.buyticker] = this.balance[transaction.buytikcer] || 0 + transaction.buyamount;
        this.transactions.push(transaction);
        // var t = transaction;
        // console.log(`TX Processed: Bought ${t.buyamount} ${t.buyticker} for ${t.sellamount}${t.sellticker}. Price ${t.buyamount/t.sellamount} ${t.buyticker} or ${t.sellamount/t.buyamount} ${t.sellticker}`)
        // validate balances are not negative
        Object.keys(this.balance).forEach(ticker => {
            if(this.balance[ticker] < 0)
                throw new Error(`Error: Negative balance for ${ticker}: ${this.balance[ticker]}${ticker}`);

        })
    }
    getTickerBalance(ticker) {
        return this.balance[ticker];
    }
    createTransaction(buyticker, buyamount, sellticker, sellamount, date) {
        return new Transaction(buyticker, buyamount, sellticker, sellamount, date);
    }
    print(value) {
        console.log(table([[,'BALANCE'],...Object.entries(this.balance), ["# TXs", this.transactions.length], ['VALUE', this.balance.USD+value.close*this.balance[value.ticker]]]));
        var data = [Transaction.header(), ...this.transactions.map(tx => [tx.date, tx.buyticker, tx.buyamount, tx.sellticker, tx.sellamount, tx.price, tx.iprice])];
        // console.log(`${this.balance.USD},${this.balance.btc || this.balance.eth || this.balance.ltc},${this.transactions.length}`)
        // console.log(table(data));
    }
}
module.exports = Wallet
