import { createPointsGF2, multiplicativeXOR, additiveXOR, findInverseGF2 } from "./gf2.js";
import {numberOfBits2} from "./Bits.js";

let form = document.querySelector("#form");
const canvas = document.getElementById("curveGraph");
const ctx = canvas.getContext("2d");
//let table = document.querySelector("#table");

form.addEventListener("submit", (event) => {
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

});
document.getElementById("pointForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        let index1 = Number(event.target["index1"].value);
        let index2 = Number(event.target["index2"].value);
        let point1 = curve.points[index1];
        let point2 = curve.points[index2];
        let options = {};
        if (curve.mod === curve.fieldOrder) {
            options.prime = true;
        } else {
            options.prime = false;
        }
        
        let newPoint = curve.calcPointAddition(point1, point2, options, curve.mod);
        drawPoint(newPoint, curve.fieldOrder, 5, "red");
        drawPoint(point1,curve.fieldOrder, 5, "blue");
        drawPoint(point2,curve.fieldOrder, 5, "yellow");
        //drawLine(0, 16, 0, 1, curve.fieldOrder);
        if (index1 !== index2) {
            drawLineDirect(point1, point2, 16);
        }
        drawLineDirectGood(point1, newPoint, options);

    } catch (e) {
        console.log("Error! find selv ud af det!");
        console.log(e);
    }
});

document.getElementById("power").addEventListener("input", () => {
    if (document.getElementById("power").value > 1) {
        document.getElementById("modoliDiv").hidden = false;
    } else {
        document.getElementById("modoliDiv").hidden = true;
    }
});

document.getElementById("scalarForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let index = Number(event.target["index"].value);
    let point = curve.points[index];
    let scale = Number(event.target["Scalar"].value);
    drawPoint(point, curve.fieldOrder, 5, "blue");
    
    if (point) {
        
    
        let options = {};
            if (curve.mod === curve.fieldOrder) {
                options.prime = true;
            } else {
                options.prime = false;
            }

        let scaledPoint = curve.calcPointMultiplication(scale, point, options, curve.mod);

        drawPoint(scaledPoint, curve.fieldOrder, 5, "red");
        drawLineDirectGood(point, scaledPoint, options);
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
function drawLineDirect (point1, point2, delay) {
    let alfa = (point2.y - point1.y)/(point2.x - point1.x);
    drawLineDirect_AUX(alfa, 0, 0.2, point1, delay);
}
function drawLineDirect_AUX (alfa, progress, speed, previousPoint, delay) {
    if (progress < curve.fieldOrder) {
        //console.log("Alfa: " + alfa);
        let newPoint = {"x":Mod(previousPoint.x + speed, curve.fieldOrder), "y":Mod(previousPoint.y+(alfa*speed), curve.fieldOrder)};
        let xDifference = newPoint.x - (previousPoint.x + (speed));
        let xMod = Math.abs(xDifference) > 0.00002;
        let yDifference = newPoint.y - (previousPoint.y + (alfa*speed));
        let yMod = Math.abs(yDifference) > 0.00002;
        if (xMod || yMod) {
            if (xMod && yMod) {
                drawLine(previousPoint.x, previousPoint.x + (speed), previousPoint.y, previousPoint.y + (alfa*speed), curve.fieldOrder,"green");
                drawLine(newPoint.x - (speed), newPoint.x, newPoint.y - (alfa*speed), curve.fieldOrder,"green");
            } else if (xMod) {
                drawLine(previousPoint.x, previousPoint.x + (speed), previousPoint.y, newPoint.y, curve.fieldOrder,"green");
                drawLine(newPoint.x - (speed), newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"green");
            } else {
                drawLine(previousPoint.x, newPoint.x, previousPoint.y, previousPoint.y + (alfa*speed), curve.fieldOrder,"green");
                drawLine(previousPoint.x, newPoint.x, newPoint.y - (alfa*speed), newPoint.y, curve.fieldOrder,"green");
            }
        } else {
            drawLine(previousPoint.x, newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"green");
        }
        //drawLine(previousPoint.x, newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"green");
        //drawPoint(newPoint, curve.fieldOrder, 1, "green");
        setTimeout(() => {drawLineDirect_AUX(alfa, progress, speed, newPoint, delay)}, delay);
    }
}

function drawLineDirectGood (point, point3, options) {
    let point1 = {x: point.x, y: point.y};
    let tempPoint = {x: point1.x, y: point1.y};
    let i = 0;

    if (options.prime == false && point3.x != 0) {
        point3.y = additiveXOR(point3.y, point3.x);
    } else if (options.prime == true) {
        point3.y = Mod(curve.fieldOrder - point3.y, curve.fieldOrder);
    }

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
    drawDots: function (size) {
        for (let element of this.points) {
            drawPoint(element, size, 5, "black");
        }
    },
    calcPointDouble: function(point, options, mod) {
        return this.calcPointAddition(point, point, options, mod);
    },
    calcPointMultiplication: function(k, P, options, mod) {              //https://scialert.net/fulltext/?doi=itj.2013.1780.1787
        let Q = P;
        let i = numberOfBits2(k);
        i >>= 1;
        //101 |1|01 => P, 1|0|1 => 2P, 10|1| => 2(2P) + P = 5P 
        while (i !== 0 ) {
            Q = this.calcPointDouble(Q, options, mod);

            
            if ((i & k) === i) {
                Q = this.calcPointAddition(P, Q, options, mod);     //Enten skal vi finde indexet på Q eller så skal vi have punktet som input i de andre funktioner
            }
            i >>= 1;
        }

        return Q;
    },
    //Point 1 (p1) and point 2 (p2)
    calcPointAddition: function(p1, p2, options, mod) {
        if (p1.x === p2.x && p1.y === p2.y) {
            if (options.prime === true) {
                let alfa = Mod((3*(p1.x*p1.x) + this.a)*inversePrime(Mod(2*p1.y, mod), mod), mod);
                let xR = Mod((alfa*alfa - 2*p1.x), mod);
                let yR = Mod(this.fieldOrder - (p1.y + alfa*(xR - p1.x)), mod);
                let R = {x: xR, y: yR, alfa: alfa};
                return R;
            } else {
                if (p1.x === 0) {
                    return {x: p1.x, y: p1.y, alfa: 0};
                }

                let alfa = additiveXOR(p1.x, multiplicativeXOR(p1.y, findInverseGF2(p1.x, mod), mod)); // x + y / x
                //let xR = (-x - x + alfa*alfa)%mod;
                //let yR = (-y + alfa*(x-xR))%mod;
                let xR = additiveXOR(additiveXOR(multiplicativeXOR(alfa, alfa, mod), alfa), this.a); // alfa^2 + alfa + a
                let yR = additiveXOR(multiplicativeXOR(p1.x, p1.x, mod), multiplicativeXOR(additiveXOR(alfa, 1), xR, mod)); // x^2 + x_3 * (alfa + 1)
                
                let R = {x: xR, y: yR, alfa: alfa};
                return R;
            }
        } else {
            if (options.prime === true) {
                let alfa = Mod((p1.y - p2.y)*inversePrime(Mod(p1.x-p2.x, mod), mod), mod);
                let xR = Mod((-p1.x - p2.x + alfa*alfa), mod);
                let yR = Mod(-p1.y + alfa*(p1.x-xR), mod);
                let R = {x: xR, y: yR, alfa:alfa};
                return R;
            } else {
                let alfa = 
                multiplicativeXOR(
                    additiveXOR(p2.y, p1.y),
                    findInverseGF2(
                        additiveXOR(p2.x,p1.x), mod
                    ),
                    mod
                );
                let xR = 
                additiveXOR(
                    additiveXOR(
                        multiplicativeXOR(alfa,alfa, mod),
                        additiveXOR(additiveXOR(this.a, alfa), p1.x)), p2.x); //m^2 + a + m + x_1 + x_2
                let yR = 
                additiveXOR(
                    additiveXOR(
                        p1.y,
                        multiplicativeXOR(alfa, additiveXOR(p1.x, xR), mod)), xR ); // y_1 + m(x_1 + x_3) + x_3
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
    if (finiteFieldSize === mod) {
        console.log("prime");
        createPointsPrime(curve, finiteFieldSize)
    } else {
        createPointsGF2(curve, finiteFieldSize, mod)
    }
    //curve.points.reverse();
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
        document.getElementById("outputTableColumn").after(newTable);
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

//SLOW
/*function numberOfBits (val) {
    if (val === 0) {
        return 1;
    }
    let i = 0;
    while (val >> i != 0) {
        i++;
    }
    return i;
}*/




function inversePrime (x, mod) {        //Enhance later (Double and add /// sqaure and multiply)
    let result = x;

    for (let i = 0 ; i < mod - 3 ; ++i) {
        result = Mod(result * x, mod);
    }

    return result;
}



function gcd (val1, val2) {

}

function calcIreduciblePoly (size) {

    
}


function isPrime(val){
    
}



function showTable(arrayValues) {
    console.log(arrayValues);
}

function clmul32(x1, x2, mod) {         //https://www.youtube.com/watch?v=v4HKU_VBbqM
    let result = 0;
    //x2 |= 0;                            //Kun nødvendig hvis der er chance for at input er double
    
    while (x1 !== 0) {
        result ^= x2 * (x1 & -x1);
        x1 &= x1 - 1;
    }

    return result;                      //
}
