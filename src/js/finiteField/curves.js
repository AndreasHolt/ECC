import {Mod} from "./FiniteFieldTablePolynomialModuli.js";
import { multiplicativeXOR, additiveXOR, findInverseGF2 } from "./gf2.js";


function createCurveAXY (a, x, y, fieldOrder, mod, additionFunction) {
    
    let curve = {
        a: a,
        b: additiveXOR(multiplicativeXOR(a,x, mod), additiveXOR(additiveXOR(multiplicativeXOR(y, y, mod), y), multiplicativeXOR(x, multiplicativeXOR(x,x, mod),mod))),
        c: 0,
        d: 1,
        points: [],
        fieldOrder: fieldOrder,
        mod: mod,
        calcPointAddition: additionFunction,
        calcPointMultiplication: function(k, P) {              //https://scialert.net/fulltext/?doi=itj.2013.1780.1787
            let Q = P;
            let i = numberOfBits2(k);
            i >>= 1;
            //101 |1|01 => P, 1|0|1 => 2P, 10|1| => 2(2P) + P = 5P 
            while (i !== 0 ) {
                Q = this.calcPointDouble(Q);
                if ((i & k) === i) {
                    Q = this.calcPointAddition(P, Q);     //Enten skal vi finde indexet på Q eller så skal vi have punktet som input i de andre funktioner
                }
                i >>= 1;
            }
    
            return Q;
        },
        calcPointDouble: function(point) {
            return this.calcPointAddition(point, point);
        },
        messageToPoint: function (m) {
            let point = {};
            if (m < 0 || m > Math.pow(2,fieldOrder)) {
                throw("Invalid message.");
            } else {
                point.x = 1;
            }


            return point;
        },
        pointToMessage: function () {

        }
    };

    if (fieldOrder === mod) {
        curve.createPoints = createPointsPrime;
    } else {
        curve.createPoints = createPointsGF2;
    }

    return curve
}

function createCurve (a, b, c, d, fieldOrder, mod, additionFunction) {
    
    let curve = {
        a: a,
        b: b,
        c: c,
        d: d,
        points: [],
        fieldOrder: fieldOrder,
        mod: mod,
        calcPointAddition: additionFunction,
        calcPointMultiplication: function(k, P) {              //https://scialert.net/fulltext/?doi=itj.2013.1780.1787
            let Q = P;
            let i = numberOfBits2(k);
            i >>= 1;
            //101 |1|01 => P, 1|0|1 => 2P, 10|1| => 2(2P) + P = 5P 
            while (i !== 0 ) {
                Q = this.calcPointDouble(Q);
                if ((i & k) === i) {
                    Q = this.calcPointAddition(P, Q);     //Enten skal vi finde indexet på Q eller så skal vi have punktet som input i de andre funktioner
                }
                i >>= 1;
            }
    
            return Q;
        },
        calcPointDouble: function(point) {
            return this.calcPointAddition(point, point);
        },
        messageToPoint: function (m) {
            let point = {};
            if (m < 0 || m > Math.pow(2,fieldOrder)) {
                throw("Invalid message.");
            } else {
                point.x = 1;
            }


            return point;
        },
        pointToMessage: function () {

        }
    };

    if (fieldOrder === mod) {
        curve.createPoints = createPointsPrime;
    } else {
        curve.createPoints = createPointsGF2;
    }

    return curve;
};

function createPointsGF2 () {
    for (let x = 0; x < this.fieldOrder ; x++) {
        let y;
        let rightSide = additiveXOR(
            additiveXOR(
                multiplicativeXOR(x, multiplicativeXOR(x, x, this.mod), this.mod),
                multiplicativeXOR(this.a, x, this.mod)
            ),
            this.b
        );
        let cx = multiplicativeXOR(this.c, x, this.mod);
        for (y = 0; y < this.fieldOrder; y++) {
            let leftSide = additiveXOR(
                additiveXOR(
                    multiplicativeXOR(y, y, this.mod),
                    multiplicativeXOR(cx, y, this.mod)
                ),
                multiplicativeXOR(this.d, y, this.mod)
            );
            if (leftSide === rightSide)
            {
                this.points.push({x: x, y: y});
                if (additiveXOR(x, y) === this.b) {
                    console.log(`x: ${x}, y: ${y}, is xor = ${this.b}.`);
                }
                if (additiveXOR(leftSide, rightSide) === 0) {
                    console.log(`x: ${x}, y: ${y}, left: ${leftSide} + right: (${rightSide}) = 0.`);
                }
            }
        }
    }
    console.log(this.points);
}


function createPointsPrime () {
    for (let x = 0 ; x < this.fieldOrder ; x++) {
        let rightSide = Mod((x*x*x + this.a*x + this.b), this.fieldOrder);
        for (let y = 0 ; y < this.fieldOrder ; y++) {
            if (Mod((y*y), this.fieldOrder) === rightSide) {
                this.points.push({x: x, y: y});
                let oppositeY = this.fieldOrder-y;
                if (oppositeY === this.fieldOrder) {
                    break;
                }
                if(Mod((oppositeY*oppositeY), this.fieldOrder) === rightSide) {
                    this.points.push({x: x, y: oppositeY});
                    break;
                }
            }
        }
    }
}

export {createCurve, createCurveAXY };