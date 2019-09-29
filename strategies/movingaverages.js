const sum = list => list.reduce((acc,cur) => acc+cur,0)
const avg = list => sum(list)/list.length;
const wawg = list => list.reduce((acc, cur,ix) => acc+(cur*(list.length-ix)), 0)/(list.length*(list.length+1)/2)
const vwap = list => list.reduce((acc, cur) => acc+(cur.price*cur.volume),0)/sum(list.map(e=>e.volume))

class EMA {
    constructor(range) {
        this.range = range;
        this.smoothing = 2.0/(range+1);
        this.values = [];
    }
    push(value) {
        this.values.push(
            this.values.length+1 < this.range ? value :
            this.values.length+1 == this.range ? avg([...this.values, value]) :
            (this.smoothing*(value - this.values[this.values.length-1]) + this.values[this.values.length-1])
        )
    }
    get value() {
        return this.values[this.values.length-1];
    }
}

class SMA {
    constructor(range) {
        this.range = range;
        this.values = []
    }
    push(value) {
        if (this.values.length === this.range)
            this.values.shift();
        this.values.push(value);
    }
    get value() {
        if (this.values.length != this.range)
            console.log("ERROR! Too many SMA values. Have", this.values.length, "but should have", this.range, "elements");
        return avg(this.values);
    }
}

class WMA {
    constructor(range) {
        this.range = range;
        this.values = []
    }
    push(value) {
        if (this.values.length === this.range)
            this.values.shift();
        this.values.push(value);
    }
    get value() {
        if (this.values.length != this.range)
            console.log("ERROR! Too many SMA values. Have", this.values.length, "but should have", this.range, "elements");
        return wawg(this.values);
    }
}

class VWAP {
    constructor(range) {
        this.range = range;
        this.values = []
    }
    push (price, volume) {
        if (this.values.length === this.range)
            this.values.shift();

        this.values.push({price: price, volume: volume});
        // console.log("VWAP:",price, volume, this.value);
    }
    get value() {
        if (this.values.length != this.range)
            console.log("ERROR! Too many VWAP values. Have", this.values.length, "but should have", this.range, "elements");
        return vwap(this.values);
    }
}

module.exports.EMA = EMA;
module.exports.SMA = SMA;
module.exports.WMA = WMA;
module.exports.VWAP = VWAP;
