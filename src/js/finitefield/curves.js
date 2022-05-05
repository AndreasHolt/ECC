import { aXOR, mXOR, multiplicativeXOR, additiveXOR, findInverseGF2 } from "./gf2.js";
import {numberOfBits2, Mod} from "./bits.js";
import {inversePrime } from "./gfp.js";


class Curve {
    constructor (a,b,c,d,fieldOrder, mod) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.points = [];
        this.fieldOrder = fieldOrder;
        this.mod = mod;
        if (this.fieldOrder === this.mod) {
            this.D = calcDiscriminant(this.a,this.b,this.c,this.d);
            this.calcPointAddition = calcPointAdditionPrime;
            this.calcPoints = createPointsPrime;
        } else {
            this.D = calcDiscriminantGF2(this.a,this.b,this.c,this.d,this.mod);
            this.calcPointAddition = calcPointAdditionGF2;
            this.calcPoints = createPointsGF2;
        }
    }

    createPoints () {
        this.calcPoints();
        /*
        let curveID = `a${this.a}b${this.b}c${this.c}d${this.d}field${this.fieldOrder}mod${this.mod}`;
        const fileUrl = new URL(`./public/curves/${curveID}.json`, import.meta.url).href
        fs.readFile(fileUrl, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(data);
        });*/
        
        /*fetch(fileUrl)
        .then(response => {
            //if (response.status === "404")
            return response.text();
        }) .then((data) => {
            console.log(data);
        }).catch((reason) => {
            console.log(reason);
            if (reason === "404") {//????
                if (this.fieldOrder === this.mod) {
                    createPointsPrime();
                } else {
                    createPointsGF2();
                }

            }
        });*/

        /*if (this.fieldOrder === this.mod) {
            createPointsPrime();
        } else {
            createPointsGF2();
        }*/
    }

    calcPointMultiplication (k, P) {
        let Q = P;
        let i = 1 << (numberOfBits2(k) - 2);

        //101 |1|01 => 2*0 + P, 1|0|1 => 2P, 10|1| => 2(2P) + P = 5P 
        while (i !== 0 ) {
            Q = this.calcPointDouble(Q);
            if ((i & k) === i) {
                Q = this.calcPointAddition(P, Q);     //Enten skal vi finde indexet på Q eller så skal vi have punktet som input i de andre funktioner
            }
            i >>= 1;
        }

        return Q;
    }

    calcPointDouble (p) {
        return this.calcPointAddition(p, p);
    }
    calcSubGroup (p) {
        let n = 2;
        let q = this.calcPointAddition(p, p);

        while (!(q.x === p.x && q.y === p.y) && !(q.x === 0 && q.y === 0)) {
            q = this.calcPointAddition(p, q);
            n++;
        }
        return n;
    }
    inverseOfPoint (p) {
        let oppositeY = Mod(this.fieldOrder-p.y, this.fieldOrder);
        return {x:p.x, y:oppositeY};
    }
    numberToPoint (num) {
        if (this.points.length >= 256) {
            if (num < 0 || num >= this.points.lengt) {
                throw("message must be a single utf-8 character");
            } else {
                return this.points[num];
            }
        } else {
            throw("Not enough points on curve.");
        }
        let point = {};
        if (m < 0 || m > Math.pow(2,fieldOrder)) {
            throw("Invalid message.");
        } else {
            point.x = 1;
        }
        return point;
    }
    pointToNumber (p) {
        let index = BigInt(this.points.findIndex((obj) => {
            return (obj.x === p.x && obj.y === p.y);
        }));
        if (index === -1) {
            throw("Point not in array.");
        } else {
            return index;
        }
    }
}

class AXYCurve extends Curve {
    constructor (a, x, y, fieldOrder, mod) {
        if (fieldOrder === mod) {
            throw("This method works only for GF2");
        }
        let b = additiveXOR(multiplicativeXOR(a,x, mod), additiveXOR(additiveXOR(multiplicativeXOR(y, y, mod), y), multiplicativeXOR(x, multiplicativeXOR(x,x, mod),mod)));
        super(a, b, 0, 1, fieldOrder, mod);
        this.G = {x,y};
    }
}

function calcDiscriminant (a,b,c,d) {
    let b2 = c*c+4*a;
    let b4 = 2*a+c*d;
    let b6 = d*d+4*b;
    let b8 = c*c*b-c*d*a-a*a;
    let D = -(b2*b2*b8)-8*b4*b4*b4-27*b6*b6+9*b2*b4*b6;
    return D;
}
function calcDiscriminantGF2 (a,b,c,d, mod) {
    let b2 = aXOR(mXOR(mod, c, c), mXOR(mod, 4, a));
    let b4 = aXOR(mXOR(mod, 2, a), mXOR(mod, c, d));
    let b6 = aXOR(mXOR(mod, d, d), mXOR(mod, 4, b));
    let b8 = aXOR(mXOR(mod, c,c,b), mXOR(mod, c,d,a), mXOR(mod, a, a));
    //-(b2*b2*b8)-8*b4*b4*b4-27*b6*b6+9*b2*b4*b6; 
    let D = aXOR(mXOR(mod, b2, b2, b8), mXOR(mod, 8, b4, b4, b4), mXOR(mod, 27, b6, b6), mXOR(mod, 9, b2, b4, b6));
    return D;
}




function calcPointAdditionPrime (p1, p2) {
    console.log(this.mod)
    if(p1.x === Infinity) {

        return p2;
    }
    if (p2.x === Infinity) {
        return p1;
    }
    if (p1.x === p2.x && p1.y === p2.y) {
        let alfa = Mod((3*(p1.x*p1.x) + this.a)*inversePrime(Mod(2*p1.y, this.mod), this.mod), this.mod);
        let xR = Mod((alfa*alfa - 2*p1.x), this.mod);
        let yR = Mod(this.fieldOrder - (p1.y + alfa*(xR - p1.x)), this.mod);
        let R = {x: xR, y: yR, alfa: alfa};
        return R;
    } else if (p1.x === p2.x) {
        let xR = Infinity;
        let yR = Infinity;
        let R = {x: xR, y: yR};
        return R;
    } else {
        let alfa = Mod((p2.y - p1.y) * inversePrime(p2.x - p1.x, this.mod), this.mod);
        let xR = Mod((-p1.x - p2.x + alfa*alfa), this.mod);
        let yR = Mod(-p1.y + alfa*(p1.x-xR), this.mod);
        let R = {x: xR, y: yR, alfa:alfa};
        return R;
    }
}

function calcPointAdditionGF2 (p1, p2) {
    if (p1.x === p2.x && p1.y === p2.y) {
        let alfa = multiplicativeXOR(                                                                                   //alfa = (3 * x^2 + a + c * y) / (2 * y + c * x + d)
            additiveXOR( multiplicativeXOR(3, multiplicativeXOR(p1.x, p1.x, this.mod), this.mod),                       //(3 * x^2 + 
            additiveXOR(this.a, multiplicativeXOR(this.c, p1.y, this.mod))),                                            //... a + c * y) *
            findInverseGF2(additiveXOR(additiveXOR(multiplicativeXOR(2, p1.y, this.mod),                                //... 1 / (2y +
            multiplicativeXOR(this.c, p1.x, this.mod)),                                                                 //... c * x + 
                this.d), this.mod), this.mod);                                                                          //... d)
            

        let xR = additiveXOR(multiplicativeXOR(alfa, alfa, this.mod), multiplicativeXOR(this.c, alfa, this.mod));       //x_3 = alfa^2 + alfa

        let yR = additiveXOR(additiveXOR(                                                                               //y_3 = c * x_3 + d + y_1 + alfa * (x_1 + x_3)
            multiplicativeXOR(this.c, xR, this.mod), this.d),                                                           //c * x_3 + d +
            additiveXOR(p1.y, multiplicativeXOR(alfa, additiveXOR(p1.x, xR), this.mod)));                               //... y_1 + alfa * (x_1 + x_3)
        
        let R = {x: xR, y: yR, alfa: alfa};
        return R;
    } else {
        let alfa = multiplicativeXOR(                                                                                   //alfa = (y_2 + y_1) / (x_2 + x_1)
            additiveXOR(p2.y, p1.y),                                                                                    //(y_2 + y_1) * 
            findInverseGF2(additiveXOR(p2.x, p1.x), this.mod), this.mod);                                               //... 1 / (x_2 + x_1) 
        
        let xR = aXOR(p2.x, p1.x, mXOR(this.mod, alfa, alfa), mXOR(this.mod, this.c, alfa));                            //x_3 = x_2 + x_1 + alfa^2 + c * alfa

        let yR = additiveXOR(                                                                                           //y_3 = -cx_3 - d - y_1 + alfa * (x_1 + x_3)
            additiveXOR(multiplicativeXOR(this.c, xR, this.mod), this.d),                                               //c * x_3 + d +
            additiveXOR(p1.y, multiplicativeXOR(alfa, additiveXOR(p1.x, xR), this.mod)));                               //... y_1 + alfa * (x_1 + x_3)
        let R = {x: xR, y: yR, alfa:alfa}
        return R;
    }
}


function createPointsGF2 () {
    for (let x = 0; x < this.fieldOrder ; x++) {
        let y;
        let rightSide = aXOR(mXOR(this.mod, x, x, x), mXOR(this.mod, this.a, x), this.b);
        let cx = mXOR(this.mod, this.c, x);
        for (y = 0; y < this.fieldOrder; y++) {
            let leftSide = aXOR(mXOR(this.mod, y, y), mXOR(this.mod, cx, y), mXOR(this.mod, this.d, y));
            if (leftSide === rightSide)
            {
                this.points.push({x: x, y: y});
                if (additiveXOR(x, y) === this.b) {
                    // console.log(`x: ${x}, y: ${y}, is xor = ${this.b}.`);
                }
                if (additiveXOR(leftSide, rightSide) === 0) {
                    //console.log(`x: ${x}, y: ${y}, left: ${leftSide} + right: (${rightSide}) = 0.`);
                }
            }
        }
    }
    this.points.push({x: Infinity, y: Infinity});
}

function createPointsPrime () {
    for (let x = 0 ; x < this.fieldOrder ; x++) {
        let rightSide = Mod((x*x*x + this.a*x + this.b), this.fieldOrder);
        for (let y = 0 ; y < this.fieldOrder ; y++) {
            if (Mod((y*y), this.fieldOrder) === rightSide) {
                this.points.push({x: x, y: y});
                let oppositeY = Mod(this.fieldOrder-y, this.fieldOrder);    //Skal der ikke laves mod her?
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
    this.points.push({x: Infinity, y: Infinity});

}

function listPoints(point1, point2, point3) {
    console.log('teeest')
    const pointsListed = document.getElementById('pointsListed');

    pointsListed.innerHTML = `\\(P = (${point1.x}, ${point1.y})\\) &nbsp \\(Q = (${point2.x}, ${point2.y})\\) &nbsp \\(R = (${point3.x}, ${point3.y})\\)`;
    // eslint-disable-next-line no-undef
    if(!(document.getElementById("explanationContainer").style.display == "none")) {
        MathJax.typeset()
    }

    return {point1, point2, point3}


}




export {Curve, AXYCurve, calcPointAdditionPrime, calcPointAdditionGF2, calcDiscriminant, calcDiscriminantGF2, listPoints};
