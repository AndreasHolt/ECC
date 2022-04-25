import {Mod} from "./FiniteFieldTablePolynomialModuli.js";
import { aXOR, mXOR, multiplicativeXOR, additiveXOR, findInverseGF2 } from "./gf2.js";
import {numberOfBits2} from "./Bits.js";


function createCurveAXY (a, x, y, fieldOrder, mod, additionFunction) {
    let curve = createCurve(fieldOrder, mod, additionFunction);
    curve.a = a;
    curve.b = additiveXOR(multiplicativeXOR(a,x, mod), additiveXOR(additiveXOR(multiplicativeXOR(y, y, mod), y), multiplicativeXOR(x, multiplicativeXOR(x,x, mod),mod)));
    curve.c = 0;
    curve.d = 1;
    curve.G = {x,y};
    if (curve.fieldOrder === curve.mod) {
        curve.D = calcDiscriminant(curve.a,curve.b,curve.c,curve.d);
    } else {
        curve.D = calcDiscriminantGF2(curve.a,curve.b,curve.c,curve.d,curve.mod);
    }

    return curve
}

function createCurveABCD (a, b, c, d, fieldOrder, mod, additionFunction) {
    
    let curve = createCurve(fieldOrder, mod, additionFunction);
    curve.a = a;
    curve.b = b;
    curve.c = c;
    curve.d = d;
    if (curve.fieldOrder === curve.mod) {
        curve.D = calcDiscriminant(curve.a,curve.b,curve.c,curve.d);
    } else {
        curve.D = calcDiscriminantGF2(curve.a,curve.b,curve.c,curve.d,curve.mod);
    }
    return curve;
};

function calcDiscriminant (a,b,c,d) {
    let b2 = c*c+4*a;
    let b4 = 2*a+c*d;
    let b6 = d*d+4*b;
    let b8 = c*c*b-c*d*a-a*a;
    let D = -(b2*b2*b8)-8*b4*b4*b4-27*b6*b6+9*b2*b4*b6;
    console.log("Discriminant: " + D);
    return D;
}
function calcDiscriminantGF2 (a,b,c,d, mod) {
    console.log(additiveXOR(multiplicativeXOR(c, c, mod), multiplicativeXOR(4, a, mod)));
    let b2 = aXOR(mXOR(mod, c, c), mXOR(mod, 4, a));
    console.log(b2);
    //additiveXOR(multiplicativeXOR(2,a, mod), multiplicativeXOR(c,d,mod));
    let b4 = aXOR(mXOR(mod, 2, a), mXOR(mod, c, d));
    //additiveXOR(multiplicativeXOR(d,d,mod), multiplicativeXOR(4,b,mod));
    let b6 = aXOR(mXOR(mod, d, d), mXOR(mod, 4, b));
    let b8 = aXOR(mXOR(mod, c,c,b), mXOR(mod, c,d,a), mXOR(mod, a, a));
    /*additiveXOR(
        additiveXOR(
            multiplicativeXOR(multiplicativeXOR(c,c,mod), b, mod),
            multiplicativeXOR(multiplicativeXOR(c,d,mod), a, mod),
        ),
        multiplicativeXOR(a, a, mod)
    );*/
    //-(b2*b2*b8)-8*b4*b4*b4-27*b6*b6+9*b2*b4*b6; 
    let D = aXOR(mXOR(mod, b2, b2, b8), mXOR(mod, 8, b4, b4, b4), mXOR(mod, 27, b6, b6), mXOR(mod, 9, b2, b4, b6));
    console.log("Discriminant: " + D);
    return D;
}

function createCurve (fieldOrder, mod, additionFunction) {
    let curve = {
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
        calcSubGroup: function(point) {
            let n = 2;
            let q = this.calcPointAddition(point, point);

            while (!(q.x === point.x && q.y === point.y) && !(q.x === 0 && q.y === 0)) {
                q = this.calcPointAddition(point, q);
                n++;
            }
            return n;
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
}



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
                    //console.log(`x: ${x}, y: ${y}, left: ${leftSide} + right: (${rightSide}) = 0.`);
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

export {createCurveABCD, createCurveAXY };