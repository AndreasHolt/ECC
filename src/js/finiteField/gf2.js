function createPointsGF2 (curve, finiteFieldSize, mod) {
    for (let x = 0; x < finiteFieldSize; x++) {
        let y;
        let rightSide = additiveXOR(
            additiveXOR(
                multiplicativeXOR(x, multiplicativeXOR(x, x, mod), mod),
                multiplicativeXOR(curve.a, multiplicativeXOR(x, x, mod), mod)
            ),
            curve.b
        );
        let cx = multiplicativeXOR(curve.c, x, mod);
        for (y = 0; y < finiteFieldSize; y++) {
            if (additiveXOR(
                    additiveXOR(
                        multiplicativeXOR(y, y, mod),
                        multiplicativeXOR(cx, y, mod)
                    ),
                    multiplicativeXOR(curve.d, y, mod)
                ) === rightSide)
            {
                curve.points.push({x:x, y:y});
                if (x !== 0) {
                    let x2 = x;
                    let y2 = additiveXOR(y,x);
                    if (additiveXOR(
                        additiveXOR(
                            multiplicativeXOR(y2, y2, mod),
                            multiplicativeXOR(cx, y2, mod)
                        ),
                        multiplicativeXOR(curve.d, y2, mod)
                    ) === rightSide)
                    {
                        curve.points.push({x:x2, y:y2});
                    }
                }
                break;
                //console.log(curve.points[curve.points.length - 1]);
            }
        }
        if (y === finiteFieldSize) {
            console.log("Error!");
        }
        //console.log(`Progress: ${(x / finiteFieldSize)*100}%`);
    }
    console.log(curve.points);
}

function additiveXOR (x1, x2) {
    return x1^x2;
}

function multiplicativeXOR (x1, x2, mod) {
    let tempResult = 0;
    let x2bitLength = numberOfBits2(x2);
    //console.log(`${x2} has ${x2bitLength} bits`);
    for (let i = 0; i <= x2bitLength; i++) {
        if (x2 >> i & 1 === 1) {
            let leftshiftedValue = x1 << i;
            tempResult = additiveXOR(leftshiftedValue, tempResult);
        }
    }
    while (numberOfBits2(tempResult) >= numberOfBits2(mod)) {
        tempResult = polyMod(tempResult, mod);
    }
    return tempResult;
}


function findInverseGF2 (x1, modoli) {
    //Find the inverse a in a*x1 = 1 (mod modoli)
    let inverse = gf2_quo_rem(gf2_eea_rec(x1, modoli).x, modoli).remainder;
    

    //Magic
    console.log("Inverse: " + inverse);
    //ExtEuclidAlgXOR(modoli, x1, modoli);

    return inverse;
}

/*function ExtEuclidAlg (a, b) {
    let quotients = [];
    let remainders = [a, b];
    let Si = [1, 0];
    let Ti = [0, 1];
    let index = 1;
    
    while (remainders[index] !== 0) {
        index++;
        quotients[index] = Math.floor(remainders[index-2] / remainders[index-1]);
        remainders[index] = remainders[index-2] - quotients[index] * remainders[index-1];
        Si[index] = Si[index - 2] - quotients[index] * Si[index - 1];
        Ti[index] = Ti[index - 2] - quotients[index] * Ti[index - 1];
        console.log(`Index: ${index} Quotient: ${quotients[index]} Remainder: ${remainders[index]} Si: ${Si[index]} Ti: ${Ti[index]}`);

    }

}

function ExtEuclidAlgXOR (a, b, mod) {
    let quotients = [];
    let remainders = [a, b];
    let Si = [1, 0];
    let Ti = [0, 1];
    let index = 1;
    
    while (remainders[index] !== 0) {
        index++;
        quotients[index] = Math.floor(remainders[index-2] / remainders[index-1]);
        remainders[index] = additiveXOR(remainders[index-2], multiplicativeXOR(quotients[index], remainders[index-1], mod));
        Si[index] = additiveXOR(Si[index - 2], multiplicativeXOR(quotients[index], Si[index - 1], mod));
        Ti[index] = additiveXOR(Ti[index - 2], multiplicativeXOR(quotients[index], Ti[index - 1], mod));
        console.log(`Index: ${index} Quotient: ${quotients[index]} Remainder: ${remainders[index]} Si: ${Si[index]} Ti: ${Ti[index]}`);

    }

}*/

// Returns d, x, y such that a*x+b*y=d
// d = gcd(a,b)
function gf2_eea_rec (a, b) {
    if (b === 0) {
        let d = a;
        let x = 1;
        let y = 0;
        return {d:d, x:x, y:y};
    } else {
        let qr = gf2_quo_rem(a,b);
        let q = qr.quotient;
        let r = qr.remainder;
        let temp = gf2_eea_rec(b, r);
        let d = temp.d;
        let x1 = temp.x;
        let y1 = temp.y;

        let x = y1;
        let y = additiveXOR(x1, multiplicativeXOR(y1, q));
        return {"d":d, "x":x, "y":y};
    }
}

function gf2_quo_rem (a, b) {
    let remainder = a;
    let quotient = 0;
    while (degree(remainder) >= degree(b)) {
        let pos = degree(remainder) - degree(b);
        remainder = remainder ^ (b << pos);
        quotient += 1<<pos
    }
    return {"quotient":quotient, "remainder":remainder};
}

function degree (a) {
    if (a === 0) {
        return -1;
    } else {
        return numberOfBits(a) - 1;
    }
}