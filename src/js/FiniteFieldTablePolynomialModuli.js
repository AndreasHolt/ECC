
let form = document.querySelector("#form");
const canvas = document.getElementById("curveGraph");
const ctx = canvas.getContext("2d");
//let table = document.querySelector("#table");

options = {
    prime: true
}

form.addEventListener("submit", handleSubmit);
document.getElementById("pointForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        let index1 = Number(event.target["index1"].value);
        let index2 = Number(event.target["index2"].value);
        if (curve.mod === curve.fieldOrder) {
            options.prime = true;
        } else {
            options.prime = false;
        }
        
        let newPoint = curve.calcPointAddition(index1, index2, options, curve.mod); 
        console.log(newPoint);
        drawPoint(newPoint, curve.fieldOrder, 5, "red");
        drawPoint(curve.points[index1],curve.fieldOrder, 5, "blue");
        drawPoint(curve.points[index2],curve.fieldOrder, 5, "yellow");
        //drawLine(0, 16, 0, 1, curve.fieldOrder);
        //drawLineDirect2(curve.points[index1], curve.points[index2]);
        console.log(curve.points[index1],curve.points[index2], newPoint);
        drawLineDirectGood(curve.points[index1], newPoint);
        /*ctx.moveTo(0,0);
        ctx.lineTo(900,900);
        ctx.stroke();*/

    } catch (e) {
        console.log("Error! find selv ud af det!");
        console.log(e);
    }
});
document.getElementById("power").addEventListener("change", () => {
    if (document.getElementById("power").value > 1) {
        document.getElementById("modoliDiv").hidden = false;
    } else {
        document.getElementById("modoliDiv").hidden = true;
    }
});

function drawLine (x1, x2, y1, y2, size, color = "black") {
    ctx.beginPath();
    ctx.moveTo(x1 * canvas.width / size, canvas.height - (y1 * canvas.height / size));
    ctx.lineTo(x2 * canvas.width / size, canvas.height - (y2 * canvas.height / size));
    ctx.strokeStyle = color;
    ctx.stroke();
    
    /*if (progress < curve.fieldOrder) {
        setTimeout(() => {drawLine(point1, point3, progress + 0.01)}, 0.1);
        let newPoint = {"x":Mod(point1.x + (progress),curve.fieldOrder), "y":Mod(point1.y+(point3.alfa*progress),curve.fieldOrder)};
        drawPoint(newPoint, curve.fieldOrder, 1, "green");
    }*/
}
function drawLineDirect (point1, point2, progress) {
    if (progress < curve.fieldOrder*5) {
        setTimeout(() => {drawLineDirect(point1, point2, progress + 0.1)}, 0.1);
        let alfa = (point2.y - point1.y)/(point2.x - point1.x);
        console.log("Alfa: " + alfa);
        let newPoint = {"x":Mod(point1.x + (progress),curve.fieldOrder), "y":Mod(point1.y+(alfa*progress),curve.fieldOrder)};
        drawPoint(newPoint, curve.fieldOrder, 1, "green");
    }
}
function drawLineDirect2 (point1, point2) {
    let dir = [point2.x - point1.x, point2.y - point1.y];
    let temp = point1;
    let currentProgress = 0;
    while (currentProgress < curve.fieldOrder) {
        let intersectWithCanvasProgress = Math.min((curve.fieldOrder - temp.x) / dir[0], (curve.fieldOrder - temp.y) / dir[1]);
        let newX = temp.x + (intersectWithCanvasProgress * dir[0]);
        let newY = temp.y + (intersectWithCanvasProgress * dir[1]);
        //draw line
        drawLine(temp.x, temp.y, newX, newY, curve.fieldOrder);
        console.log(`Draw line from x1: ${temp.x}, x2: ${newX}, y1: ${temp.y}, y2: ${newY}, progress: ${intersectWithCanvasProgress}.`);
        temp = {x:Mod(newX, curve.fieldOrder), y:Mod(newY, curve.fieldOrder)};
        currentProgress = currentProgress + intersectWithCanvasProgress;
    }


    /*if (progress < curve.fieldOrder*5) {
        setTimeout(() => {drawLineDirect(point1, point2, progress + 0.1)}, 0.1);
        let alfa = (point2.y - point1.y)/(point2.x - point1.x);
        console.log("Alfa: " + alfa);
        let newPoint = {"x":Mod(point1.x + (progress),curve.fieldOrder), "y":Mod(point1.y+(alfa*progress),curve.fieldOrder)};
        drawPoint(newPoint, curve.fieldOrder, 1, "green");
    }*/
}

function drawLineDirectGood (point1, point3) {
    let tempPoint = {x: point1.x, y: point1.y}
    let i = 0;

    if (options.prime == false && point3.x != 0) {
        point3.y = additiveXOR(point3.y, point3.x);
    } else if (options.prime == true) {
        point3.y = Mod(curve.fieldOrder - point3.y, curve.fieldOrder);
        console.log("please");
    }
    console.log(point3);

    while(((tempPoint.x != point3.x) || (tempPoint.y != point3.y)) && i < 100) {
        tempPoint.x += 1;
        tempPoint.y += point3.alfa;

        if (tempPoint.x === curve.fieldOrder && tempPoint.y >= curve.fieldOrder) {
            drawLine(point1.x, (tempPoint.x - (tempPoint.y - curve.fieldOrder) * (1 / point3.alfa)), point1.y, curve.fieldOrder, curve.fieldOrder);
            point1.x = tempPoint.x - (tempPoint.y - curve.fieldOrder) * (1 / point3.alfa);
            point1.y = 0;
            drawLine(tempPoint.x - (tempPoint.y - curve.fieldOrder) * (1 / point3.alfa), curve.fieldOrder, 0, point1.y, curve.fieldOrder);
        } else if (tempPoint.x === curve.fieldOrder) {
            drawLine(point1.x, tempPoint.x, point1.y, tempPoint.y, curve.fieldOrder);
            point1.x = 0;
            point1.y = tempPoint.y;
        } else if (tempPoint.y >= curve.fieldOrder) {
            drawLine(point1.x, (tempPoint.x - (tempPoint.y- curve.fieldOrder) / point3.alfa), point1.y, curve.fieldOrder, curve.fieldOrder);
            point1.x = tempPoint.x - (tempPoint.y - curve.fieldOrder) / point3.alfa;
            point1.y = 0;
        }

        tempPoint.x = Mod(tempPoint.x, curve.fieldOrder);
        tempPoint.y = Mod(tempPoint.y, curve.fieldOrder);

        ++i;
    }
    console.log(point1, tempPoint);
    drawLine(point1.x, tempPoint.x, point1.y, tempPoint.y, curve.fieldOrder);

    if (tempPoint.x === point3.x && tempPoint.y === point3.y) {
        drawLine(tempPoint.x, point3.x, tempPoint.y, Mod(curve.fieldOrder - point3.y, curve.fieldOrder), curve.fieldOrder, "green");
    }
}

function drawPoint (point, size, pointSize, color) {
    //console.log("Hello1");
    ctx.beginPath();
    ctx.arc(point.x * canvas.width / size, canvas.height - (point.y * canvas.height / size), pointSize, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

//Curve function //Form y^2 + cxy + dy = x^3 + ax^2 + b
let curve = {
    "a": 1,
    "b": 1,
    "c": 1,
    "d": 0,
    "mod": 0,
    "fieldOrder": 0,
    points: [],
    drawDots: (size) => {
        //console.log("Hello");
        for (let element of curve.points) {
            drawPoint(element, size, 5, "black");
        }
    },
    calcPointDouble: (index, options, mod) => {
        return this.calcPointAddition(index, index, options, mod);
    },
    calcPointAddition: function(index1, index2, options, mod) {
        if (index1 === index2) {
            if (options.prime === true) {
                let x = this.points[index1].x;
                let y = this.points[index1].y;
                let alfa = Mod((3*(x*x) + curve.a)*inversePrime(Mod(2*y, mod), mod), mod);
                let xR = Mod((alfa*alfa - 2*x), mod);
                let yR = Mod(curve.fieldOrder - (y + alfa*(xR - x)), mod);
                let R = {x: xR, y: yR, alfa: alfa};
                return R;
            } else {
                let x = this.points[index1].x;
                let y = this.points[index1].y;

                if (x === 0) {
                    return {x: x, y: y, alfa: 0};
                }

                let alfa = additiveXOR(x, multiplicativeXOR(y, findInverseGF2(x, mod), mod)); // x + y / x
                //let xR = (-x - x + alfa*alfa)%mod;
                //let yR = (-y + alfa*(x-xR))%mod;
                let xR = additiveXOR(additiveXOR(multiplicativeXOR(alfa, alfa, mod), alfa), curve.a); // alfa^2 + alfa + a
                let yR = additiveXOR(multiplicativeXOR(x, x, mod), multiplicativeXOR(additiveXOR(alfa, 1), xR, mod)); // x^2 + x_3 * (alfa + 1)
                
                let R = {x: xR, y: yR, alfa: alfa};
                return R;
            }
        } else {
            if (options.prime === true) {
                let point1 = this.points[index1];
                let point2 = this.points[index2];
                let alfa = Mod(((point2.y - point1.y)*inversePrime(Mod(point2.x-point1.x, mod), mod)), mod);
                let xR = Mod((-point1.x - point2.x + alfa*alfa), mod);
                let yR = Mod(-point1.y + alfa*(point1.x-xR), mod);
                let R = {x: xR, y: yR, alfa:alfa}
                return R;
            } else {
                let point1 = this.points[index1];
                let point2 = this.points[index2];
                console.log(additiveXOR(point2.x,point1.x));
                let alfa = 
                multiplicativeXOR(
                    additiveXOR(point2.y, point1.y),
                    findInverseGF2(
                        additiveXOR(point2.x,point1.x), mod
                    ),
                    mod
                );
                let xR = 
                additiveXOR(
                    additiveXOR(
                        multiplicativeXOR(alfa,alfa, mod),
                        additiveXOR(additiveXOR(curve.a, alfa), point1.x)), point2.x); //m^2 + a + m + x_1 + x_2
                let yR = 
                additiveXOR(
                    additiveXOR(
                        point1.y,
                        multiplicativeXOR(alfa, additiveXOR(point1.x, xR), mod)), xR ); // y_1 + m(x_1 + x_3) + x_3
                let R = {x: xR, y: yR, alfa:alfa}
                return R;
            }
        }
    }
};

function Mod (val, mod) {
    return ((val % mod) + mod) % mod;
}
//element = {x}
let elements = [];

function createPoints (curve, finiteFieldSize, mod) {
    console.log(finiteFieldSize);
    console.log(mod);
    if (finiteFieldSize === mod) {
        console.log("prime");
        createPointsPrime(curve, finiteFieldSize)
    } else {
        createPointsGF2(curve, finiteFieldSize, mod)
    }
    curve.points.reverse();
}


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




function createPointsPrime (curve, finiteFieldSize) {
    for (let x = 0 ; x < finiteFieldSize ; x++) {
        let rightSide = Mod((x*x*x + curve.a*x + curve.b), finiteFieldSize);
        for (let y = 0 ; y < finiteFieldSize ; y++) {
            if (Mod((y*y), finiteFieldSize) === rightSide) {
                curve.points.push({x:x, y:y});
                let oppositeY = finiteFieldSize-y;
                if (oppositeY === finiteFieldSize) {
                    break;
                }
                if(Mod((oppositeY*oppositeY), finiteFieldSize) === rightSide) {
                    curve.points.push({x:x, y:oppositeY});
                    break;
                }
            }
        }
    }
}


function handleSubmit (event) {
    event.preventDefault();
    curve.points = [];
    let prime = Number(event.target["prime"].value);
    let power = Number(event.target["power"].value);
    let sizeOfTable = Math.pow(prime, power);
    curve.fieldOrder = sizeOfTable;
    let optionsList = [{mode:"multiplicative"},{mode:"additive"}];
    let modoli;

    if (power > 1) {
        modoli = Number(event.target["modoli"].value);
        //curve.c = 1;
        //curve.d = 1;
    } else {
        modoli = prime;
        curve.c = 0;
        curve.d = 0;
    }
    curve.mod = modoli;
    
    for (let options of optionsList) {
        let arrayValues = createTable(sizeOfTable, modoli, options);
        createTableHTML(arrayValues, sizeOfTable, options.mode);
    }
    
    createPoints(curve, sizeOfTable, modoli);
    curve.drawDots(sizeOfTable);

}

/*for (let letter of "hej med dig!") {
    var charCode = letter.charCodeAt(0);
    console.log(charCode);
    console.log(letter);
}*/

function createTableHTML (tableArray, tableSize, htmlID) {
    let oldTable = document.getElementById(htmlID);
    let newTable = document.createElement("table");
    newTable.id = htmlID;

    let headerRow = document.createElement("tr");
    for (let i = -1; i < tableSize; i++) {
        let header = document.createElement("th");
        if (i !== -1) {
            header.textContent = i;
        } else {
            if (htmlID === "multiplicative") {
                header.textContent = "*";
            } else if (htmlID === "additive"){
                header.textContent = "+";
            }
        }
        headerRow.appendChild(header);
    }
    newTable.appendChild(headerRow);

    //For each row
    for (let rowIndex = 0; rowIndex < tableSize; rowIndex++) {
        let row = document.createElement("tr");
        let dataCell = document.createElement("td");
        dataCell.textContent = rowIndex;
        row.appendChild(dataCell);
        for (let i = 0; i < tableSize; i++) {
            let dataCell = document.createElement("td");
            dataCell.textContent = tableArray[i][rowIndex];
            row.appendChild(dataCell);
        }
        newTable.appendChild(row);
    }

    if (oldTable) {
        oldTable.replaceWith(newTable);
    } else {
        document.getElementById("inputDiv").after(newTable);
    }

}


function createTable (sizeOfTable, mod, options) {
    let arrayValues = [];
    if (options.mode === "additive") {
        arrayValues = calculateElements(sizeOfTable, mod, additiveXOR);
        
    } else if (options.mode === "multiplicative") {
        arrayValues = calculateElements(sizeOfTable, mod, multiplicativeXOR);
    }
    
    return arrayValues;
}

function calculateElements(size, mod, combinationFunction) {
    let arrayValues = [];
    for (let i = 0; i < size; i++) {
        let column = [];
        for (let j = 0; j < size; j++) {
            column[j] = combinationFunction(i, j, mod);
        }
        arrayValues[i] = column;
    }
    return arrayValues;
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

/*function multiplicativeXOR2 (a,b, mod) {
    let result = 0;
    while (a !== 0) {
        if (a & 1 === 1) {
            result ^=b
        }
        a = a >> 1;
        b = b << 1;
    }
    return result;
}*/

function numberOfBits2 (val) {
    return Math.floor(Math.log2(val)) + 1;
}
function numberOfBits (val) {
    if (val === 0) {
        return 1;
    }
    let i = 0;
    while (val >> i != 0) {
        i++;
    }
    return i;
}

function bitCount (n) {
    if (n > 0) {
        n = n - ((n >> 1) & 0x55555555);
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
        return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
    } else {
        return 1;
    }
}

function count1s32(i) {
    /*
    var count = 0;
    i = i - ((i >> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
    i = (i + (i >> 4)) & 0x0f0f0f0f;
    i = i + (i >> 8);
    i = i + (i >> 16);
    count += i & 0x3f;
    return count;
    */
    return i.toString(2).length;
}


function additiveXOR (x1, x2) {
    return x1^x2;
}

function inversePrime (x, mod) {
    return Mod(Math.pow(x, mod - 2),mod);
}

function findInverseGF2 (x1, modoli) {
    //Find the inverse a in a*x1 = 1 (mod modoli)
    let inverse = gf2_quo_rem(gf2_eea_rec(x1, modoli).x, modoli).remainder;
    

    //Magic
    console.log("Inverse: " + inverse);
    //ExtEuclidAlgXOR(modoli, x1, modoli);

    return inverse;
}

function ExtEuclidAlg (a, b) {
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

}

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

function gcd (val1, val2) {

}

function calcIreduciblePoly (size) {

    
}
//Performs modulo operation on the polynomial.
function polyMod (value, mod) {
    return value ^ (mod << (numberOfBits2(value) - numberOfBits2(mod)));
}

function isPrime(val){
    
}



function showTable(arrayValues) {
    console.log(arrayValues);
}









