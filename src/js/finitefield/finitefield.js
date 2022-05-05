import { multiplicativeXOR, additiveXOR, findInverseGF2, aXOR, mXOR } from "./gf2.js";
import {numberOfBits2, Mod} from "./bits.js";
import {listPoints, createCurveABCD, createCurveAXY, calcPointAdditionPrime, calcPointAdditionGF2, calcDiscriminant, calcDiscriminantGF2} from "./curves.js";
import { addField, inversePrime, multiplyField } from "./gfp.js";
import {twoDecimalRound} from "../infinitefield/realsAddition"
import {checkExplanationDisplay} from "../infinitefield/graphHelpers"

const canvas = document.getElementById("curveGraph");
let ctx;
if (canvas) {
    ctx = canvas.getContext("2d");
}
//let table = document.querySelector("#table");

let curve;

let newCalculatedPoints = [];

document.getElementById('explanationExpand').addEventListener('click', () => {
    const container = document.getElementById('explanationContainer');
    if (container.style.display === 'none' && document.getElementsByClassName('clickedPoint').length === 0) {
        alert('Place points on the graph first!');
    } else if (container.style.display === 'none') {
        container.style.display = '';
        MathJax.typeset();
    } else {
        container.style.display = 'none ';
    }


    function isOnPage(element) { // TODO IMPORT INSTEAD
        return (element === document.body) ? false : document.body.contains(element);
    }

    // IF button is disabled
    if(document.getElementById('pointAddition').disabled) {
        document.getElementById('additionTable').addEventListener('click', () => {
            // TODO remove event listener for the other if active?
            
            if(isOnPage(document.getElementById('additive'))) {
                document.getElementById('additive').remove();
                document.getElementById('additionTable').innerHTML = "Show Additive Table"


            } else {
                let arrayValues = createTable(curve.fieldOrder, curve.mod, {mode:"additive"})
            createTableHTML(arrayValues, curve.fieldOrder, "additive", "outputTableAddition", "color");
            document.getElementById('additionTable').innerHTML = "Hide Additive Table"
            }

        });

    } else if(document.getElementById('pointMultiplication')){
        document.getElementById('multiplicationTable').addEventListener('click', () => {

        });
    }
});

init();

document.querySelector("#form").addEventListener("submit", (event) => {
    event.preventDefault();
    let prime;
    let power;
    let modoli;
    let additionFunction;
    let createPointsFunction;
    let discriminant;

    document.querySelectorAll("circle").forEach( (el) => {
        el.remove();
    });

    let a = Number(event.target["a"].value);
    let b = Number(event.target["b"].value);
    let c = 0;
    let d = 0;

    switch (event.target["curveList"].value) {
        case ("Prime 5"):
            prime = 5;
            power = 1;
            modoli = 5;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("Prime 17"):
            prime = 17;
            power = 1;
            modoli = 17;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("Prime 37"):
            prime = 37;
            power = 1;
            modoli = 37;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("Prime 131"):
            prime = 131;
            power = 1;
            modoli = 131;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("Prime 257"):
            prime = 257;
            power = 1;
            modoli = 257;
            additionFunction = calcPointAdditionPrime;
            break;
        case ("GF2 4"):
            prime = 2;
            power = 4;
            modoli = 19;
            additionFunction = calcPointAdditionGF2;
            break;
        case ("GF2 5"):
            prime = 2;
            power = 5;
            modoli = 37;
            additionFunction = calcPointAdditionGF2;
            break;
        case ("GF2 8"):
            prime = 2;
            power = 8;
            modoli = 285;
            additionFunction = calcPointAdditionGF2;
            break;
    }
    
    if (event.target["curveList"].value.includes("GF")) {
        c = Number(event.target["c"].value);
        d = Number(event.target["d"].value);
        discriminant = calcDiscriminantGF2(a, b, c, d, modoli);
    } else {
        discriminant = calcDiscriminant(a, b, c, d);
    }
    
    try {
        if (discriminant === 0) {
            throw "Discriminant is 0, please choose another curve";
        }
        if (discriminant === null) {
            throw "Discriminant is null";
        } 
    } catch (error) {
        alert(error);
    }

    curve = createCurveABCD(a, b, c, d, Math.pow(prime, power), modoli, additionFunction);

    


    //console.log("Subgroup for G: " + curve.calcSubGroup(curve.G));
    curve.createPoints();
    drawPoints(curve.points, curve.fieldOrder);
    /*
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
*/
});

function pointAdditionFinite(index1, index2) {
    let lines = document.querySelectorAll(".line");

    lines.forEach(line => {
        line.remove();
    })
    newCalculatedPoints.forEach(point => {
        point.remove()

    });

 try {
        let point1 = curve.points[index1];
        let point2 = curve.points[index2];
        let options = {};
        if (curve.mod === curve.fieldOrder) {
            options.prime = true;
        } else {
            options.prime = false;
        }

        let newPoint = curve.calcPointAddition(point1, point2);
        newCalculatedPoints.push(drawPointElement(newPoint, curve.fieldOrder, 5, "orange", true));

        highlightPointTimeout(newPoint, 5, curve.fieldOrder);
        newCalculatedPoints.push(drawPointElement(point1, curve.fieldOrder, 5, "red", true));
        newCalculatedPoints.push(drawPointElement(point2, curve.fieldOrder, 5, "red", true));



        let listedPoints = listPoints(point1, point2, newPoint) // NEEDS TO PASS THE INVERSE_OF_POINT
     
        pointAdditionSteps(listedPoints)


        //drawLine(0, 16, 0, 1, curve.fieldOrder);
        if (index1 !== index2) {
            //drawLineDirect(point1, point2, newPoint, 100);
        }
        drawLineDirectGood(point1, newPoint, {"prime": curve.fieldOrder == curve.mod ? true : false});
    } catch (e) {
        console.log("Error! find selv ud af det!");
        console.log(e);
    }
}

document.getElementById("additionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let index1 = Number(event.target["index1"].value);
    let index2 = Number(event.target["index2"].value);
    pointAdditionFinite(index1, index2);
});


/*document.getElementById("power").addEventListener("input", () => {
    if (document.getElementById("power").value > 1) {
        document.getElementById("modoliDiv").hidden = false;
    } else {
        document.getElementById("modoliDiv").hidden = true;
    }
});*/

/*document.getElementById("Scalar").addEventListener("input", (event) => {
    let index = Number(document.getElementById("index").value);
    let point = curve.points[index];
    let scale = Number(event.target.value);
    if (point) {

        let scaledPoint = curve.calcPointMultiplication(scale, point);
        highlightPointTimeout(scaledPoint, 1000, curve.fieldOrder);

    }
});*/
let createTableButton = document.getElementById("createTablesButton");
createTableButton.addEventListener("click", () => {
    let optionsList = [{mode:"multiplicative"},{mode:"additive"}];
    for (let options of optionsList) {
        let arrayValues = createTable(curve.fieldOrder, curve.mod, options);
        createTableHTML(arrayValues, curve.fieldOrder, options.mode, "outputTableColumn", "nocolor");
    }
});

document.getElementById("scalarForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let index = Number(event.target["index"].value);
    let point = curve.points[index];
    let scale = Number(event.target["Scalar"].value);
    drawPoint(point, curve.fieldOrder, 5, "blue");

    if (point) {
        let scaledPoint = curve.calcPointMultiplication(scale, point);
        drawPoint(scaledPoint, curve.fieldOrder, 5, "red");
        drawLineDirectGood(point, scaledPoint, {"prime": curve.fieldOrder == curve.mod ? true : false});
    }
});

function drawLine (x1, x2, y1, y2, size, color = "black") {
    ctx.beginPath();
    ctx.moveTo((x1 * canvas.width / size)-3, (canvas.height - (y1 * canvas.height / size)) -3);
    ctx.lineTo((x2 * canvas.width / size)-3, (canvas.height - (y2 * canvas.height / size)) - 3);
    ctx.strokeStyle = color;
    ctx.stroke();
    drawLineSvg1(x1, x2, y1, y2, size);
    /*if (progress < curve.fieldOrder) {
        setTimeout(() => {drawLine(point1, point3, progress + 0.01)}, 0.1);
        let newPoint = {"x":Mod(point1.x + (progress),curve.fieldOrder), "y":Mod(point1.y+(point3.alfa*progress),curve.fieldOrder)};
        drawPoint(newPoint, curve.fieldOrder, 1, "green");
    }*/
}
function drawLineDirect (point1, point2, newPoint, delay) {
    let alfa = (point2.y - point1.y)/(point2.x - point1.x);
    drawLineDirect_AUX(alfa, 0, 0.2, point1, newPoint, delay);
}
function drawLineDirect_AUX (alfa, progress, speed, previousPoint, target, delay) {
    if (progress < curve.fieldOrder) {
        //console.log("Alfa: " + alfa);
        let newPoint = {"x":Mod(previousPoint.x + speed, curve.fieldOrder), "y":Mod(previousPoint.y+(alfa*speed), curve.fieldOrder)};
        let xDifference = newPoint.x - (previousPoint.x + (speed));
        let xMod = Math.abs(xDifference) > 0.00002;
        let yDifference = newPoint.y - (previousPoint.y + (alfa*speed));
        let yMod = Math.abs(yDifference) > 0.00002;
        
        //drawLine(previousPoint.x, newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"green");
        //drawPoint(newPoint, curve.fieldOrder, 1, "green");

        if ((previousPoint.x - target.x) / (newPoint.x - target.x) < 0 || (xMod && (previousPoint.x - target.x - curve.fieldOrder) / (newPoint.x - target.x) < 0)) {
            drawLine(previousPoint.x, target.x, previousPoint.y, target.y, curve.fieldOrder,"black");
            drawLine(target.x, target.x, Mod(target.y - curve.fieldOrder, curve.mod), target.y, curve.fieldOrder,"green");
            return;
        } else {
            if (xMod || yMod) {
                if (xMod && yMod) {
                    drawLine(previousPoint.x, previousPoint.x + (speed), previousPoint.y, previousPoint.y + (alfa*speed), curve.fieldOrder,"green");
                    drawLine(newPoint.x - (speed), newPoint.x, newPoint.y - (alfa*speed), curve.fieldOrder,"black");
                } else if (xMod) {
                    drawLine(previousPoint.x, previousPoint.x + (speed), previousPoint.y, newPoint.y, curve.fieldOrder,"black");
                    drawLine(newPoint.x - (speed), newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"black");
                } else {
                    drawLine(previousPoint.x, newPoint.x, previousPoint.y, previousPoint.y + (alfa*speed), curve.fieldOrder,"black");
                    drawLine(previousPoint.x, newPoint.x, newPoint.y - (alfa*speed), newPoint.y, curve.fieldOrder,"black");
                }
            } else {
                drawLine(previousPoint.x, newPoint.x, previousPoint.y, newPoint.y, curve.fieldOrder,"black");
            }
            setTimeout(() => {drawLineDirect_AUX(alfa, progress, speed, newPoint, target, delay)}, delay);
        }
        return;
    }
}

function drawLineDirectGood (point, point3, options) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let point1 = {x: point.x, y: point.y};
    let tempPoint = {x: point1.x, y: point1.y};
    let i = 0;

    if (options.prime == false && point3.x != 0) {
        point3.y = additiveXOR(point3.y, point3.x);
    } else if (options.prime == true) {
        point3.y = Mod(curve.fieldOrder - point3.y, curve.fieldOrder);
    }

    newCalculatedPoints.push(drawPointElement(point3, curve.fieldOrder, 5, "fuchsia", true));

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

function drawPoints (arrayPoints, fieldOrder) {
    let pointSize = canvas.width / (fieldOrder * 1.25) < 5 ? canvas.width / (fieldOrder * 1.25) : 5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let point of arrayPoints) {
        drawPointElement(point, fieldOrder, pointSize, "rgb(59,129,246)");
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

function highlightPointTimeout (point, time, size) {
    let svg = document.getElementById("highlightSVG");
    var svgns = "http://www.w3.org/2000/svg";
    var circle = document.createElementNS(svgns, 'circle');
    let x = point.x * canvas.width / size;
    let y = canvas.height - (point.y * canvas.height / size);
    if (point.x === Infinity) {
        circle.setAttributeNS(null, 'cx', canvas.width);
        circle.setAttributeNS(null, 'cy', 0);
    } else {
        circle.setAttributeNS(null, 'cx', x);
        circle.setAttributeNS(null, 'cy', y);
    }
    circle.setAttributeNS(null, 'r', 10);
    circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
    circle.style.zIndex = '50000';
    svg.appendChild(circle);
    setTimeout(() => {
        svg.removeChild(circle);
    }, time);
}
function highlightPoint (point, size) {
    let svg = document.getElementById("highlightSVG");
    var svgns = "http://www.w3.org/2000/svg";
    var circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', point.x * canvas.width / size);
    circle.setAttributeNS(null, 'cy', canvas.height - (point.y * canvas.height / size));
    circle.setAttributeNS(null, 'r', 10);
    circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
    svg.appendChild(circle);
    return circle;
}

function pointDescription(point) {
    let negation = {x: point.x, y: point.y}; // If unable to find negation use ifself
    let subGroupPoint = {x: point.x, y: point.y}; //virker ikke
    let subGroup = [];
    let orderOfSubGroup = 0;
    if (point.x === Infinity) {
        return {negation, subGroup, orderOfSubGroup: orderOfSubGroup - 2};
    }

    if (curve.mod === curve.fieldOrder) {
        negation.y = (curve.fieldOrder - point.y) % curve.fieldOrder;
    } else {
        for (let i of curve.points) {
            if (i.x === point.x && i.y !== point.y) {
                negation = i;
            }
        }
    }
    

    while (subGroupPoint.x !== negation.x || subGroupPoint.y !== negation.y) {
        subGroupPoint = curve.calcPointAddition(subGroupPoint, point);
        subGroup[orderOfSubGroup] = subGroupPoint;
        orderOfSubGroup++;
        
    }

    return {negation, subGroup, orderOfSubGroup};
}


function drawPointElement (point, size, pointSize, color, temp = false) {
    if(newCalculatedPoints.length !== 0) {
        newCalculatedPoints.forEach(point => {
            point.remove()

        });
    }

    let svg = document.getElementById("highlightSVG");
    var svgns = "http://www.w3.org/2000/svg";
    var circle = document.createElementNS(svgns, 'circle');
    circle.style.pointerEvents = 'none' // TODO: Maybe remove later
    if (point.x === Infinity) {
        circle.setAttributeNS(null, 'cx', canvas.width);
        circle.setAttributeNS(null, 'cy', 0);
    } else {
        circle.setAttributeNS(null, 'cx', point.x * canvas.width / size);
        circle.setAttributeNS(null, 'cy', canvas.height - (point.y * canvas.height / size));
    }
    
    circle.setAttributeNS(null, 'r', pointSize);                                                             //(canvas.height / (curve.fieldOrder * 1.2)) <= 5 ? (canvas.height / (curve.fieldOrder * 1.2)) : 5)
    circle.setAttributeNS(null, 'style', `fill: ${color}; stroke: ${color}; stroke-width: 1px;` );
    svg.appendChild(circle);

    circle.addEventListener("click", () => {
        ctx.clearRect(0, 0, 600, 600);
        let clickedPoints = document.getElementsByClassName('clickedPoint')
        let circles = document.querySelectorAll('circle')


        circles.forEach(circle => {
            if(!circle.classList.contains('clickedPoint')) {
                circle.setAttributeNS(null, 'style', 'fill: rgb(59,129,246); stroke: rgb(59,129,246); stroke-width: 1px;');
            } else if(circle.hasAttribute('pointerEvents')) {
                circle.remove();
            }

        });
        
        let indexOfClickedPoints = [];


        if(clickedPoints.length ===  2) {
            for(let i = clickedPoints.length - 1; i >= 0; i--) {
                clickedPoints[i].setAttributeNS(null, 'style', 'fill: rgb(59,129,246); stroke: rgb(59,129,246); stroke-width: 1px;');
                clickedPoints[i].classList.remove('clickedPoint')
            }

        }
        circle.classList.add('clickedPoint')

        if(clickedPoints.length === 2) {
            for(let i = 0; i < curve.points.length; i++) {
                if(circles[i].classList.contains('clickedPoint')){
                    indexOfClickedPoints.push(i);
                }

            }
            
            pointAdditionFinite(indexOfClickedPoints[0], indexOfClickedPoints[1])
            //drawLineSvg(clickedPoints[0], clickedPoints[1]);

        }


        circle.setAttributeNS(null, 'style', 'fill: red; stroke: red; stroke-width: 1px;' );
    });
    circle.addEventListener("mouseover", () => {
        let pointDetailArray = pointDescription(point);


        let orderOfSubGroupString = `(${point.x}, ${point.y}), `;
        for(let i = 0; i < pointDetailArray.orderOfSubGroup; i++) {
            orderOfSubGroupString += `(${pointDetailArray.subGroup[i].x}, ${pointDetailArray.subGroup[i].y}) → `;
        }

        orderOfSubGroupString += `∞`;

        let output = document.getElementById("pointInfo");
        let index;
        curve.points.every((elem, i) => {
            if (elem.x === point.x && elem.y === point.y){
                index = i;
                return false;
            }

            return true;
        });

        let pointDetails = [`<span class="detailKey">Index:</span> ${index}`, `<span class="detailKey">Point:</span> (${point.x}, ${point.y})`, `<span class="detailKey">Inverse:</span> (${pointDetailArray.negation.x}, ${pointDetailArray.negation.y})`, `<span class="detailKey">Subgroup: </span> ${pointDetailArray.orderOfSubGroup + 2}`,`<span class="detailKey">Generated sub group: </span> ${orderOfSubGroupString}`];

        output.innerHTML = "";


        for(let i = 0; i < pointDetails.length; i++) {
            let p = document.createElement("p");
            output.appendChild(p);
            p.setAttribute("class", "pointDetails");

            p.innerHTML += pointDetails[i];

            let detailKey = document.getElementsByClassName("detailKey");
            detailKey[i].classList.add("tracking-wide", "text-gray-700", "text-x", "font-bold", "mb-2")


        }

        //svg.appendChild(pointText(point, temp));
    });
    
    circle.addEventListener("mouseover", () => {
        highlightPointTimeout(point, 400, curve.fieldOrder);
    });

    if(temp) {
        circle.style.pointerEvents = "none"
    }

    return circle;
}


function pointText (point, eq = "") {
    let textNode;
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    textElement.setAttribute('x', point.x * canvas.width / curve.fieldOrder);
    textElement.setAttribute('y', canvas.height - (point.y * canvas.height / curve.fieldOrder));

    if (eq) {
        textNode = document.createTextNode(eq + `(${point.x}, ${point.y})`);
        //textElement.setAttribute('id', eq);
    } else {
        textNode = document.createTextNode(`(${point.x}, ${point.y})`);
    }

    textElement.appendChild(textNode);
    return textElement;
}





function createTableHTML (tableArray, tableSize, htmlID, outputID, colorBool) {
    let oldTable = document.getElementById(htmlID);
    let newTable = document.createElement("table");
    newTable.id = htmlID;

    let pointXY;

    (colorBool === "color")?(console.log('test1')):(console.log('test2'));

    let headerRow = document.createElement("tr");

    for (let i = -1; i < tableSize; i++) {
        let header = document.createElement("th");


        if (i !== -1) {
            header.textContent = i;
            header.classList.add("text-sm", "text-white", "font-medium", "px-2", "py-2", "whitespace-nowrap")

        } else {
            header.classList.add("border-b", "bg-gray-800", "border-gray-800")

            header.classList.add("text-sm", "text-white", "font-medium", "px-6", "py-6", "whitespace-nowrap")
            newTable.classList.add("inline-block", "relative", "w-64", "basis-1/2", "table-fixed")

            if (htmlID === "multiplicative") {
                header.textContent = "*";


            } else if (htmlID === "additive"){
                header.textContent = "+";

            }
        }
        headerRow.classList.add("border-b", "bg-gray-800", "border-gray-900")

        headerRow.appendChild(header);
    }
    newTable.appendChild(headerRow);


    //For each row
    for (let rowIndex = 0; rowIndex < tableSize; rowIndex++) {
        let row = document.createElement("tr");

        let dataCell = document.createElement("td");
        dataCell.textContent = rowIndex;

        row.appendChild(dataCell);

        row.firstChild.classList.add("border-b", "bg-gray-800", "border-gray-800", "text-sm", "text-white", "font-medium", "whitespace-nowrap", "text-center")
        for (let i = 0; i < tableSize; i++) {
            let dataCell = document.createElement("td");
            dataCell.textContent = tableArray[i][rowIndex];
            dataCell.classList.add('mx-10', 'my-100')
            row.appendChild(dataCell);
        }
        newTable.appendChild(row);
    }

    if (oldTable) {
        oldTable.replaceWith(newTable);
    } else {
        document.getElementById(outputID).appendChild(newTable);
    }

}


function createTable (sizeOfTable, mod, options) {
    let arrayValues = [];
    if (sizeOfTable !== mod) {
        if (options.mode === "additive") {
            arrayValues = calculateElements(sizeOfTable, mod, additiveXOR);
    
        } else if (options.mode === "multiplicative") {
            arrayValues = calculateElements(sizeOfTable, mod, multiplicativeXOR);
        }
    } else {
        if (options.mode === "additive") {
            arrayValues = calculateElements(sizeOfTable, mod, addField);
    
        } else if (options.mode === "multiplicative") {
            arrayValues = calculateElements(sizeOfTable, mod, multiplyField);
        }
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



function gcd (val1, val2) {

}

function calcIreduciblePoly (size) {


}


function isPrime(val){

}



function showTable(arrayValues) {
    console.log(arrayValues);
}

function clmul32(x1, x2, mod) {         // https://www.youtube.com/watch?v=v4HKU_VBbqM
    let result = 0;
    //x2 |= 0;                            // Kun nødvendig hvis der er chance for at input er double

    while (x1 !== 0) {
        result ^= x2 * (x1 & -x1);
        x1 &= x1 - 1;
    }

    return result;                      //
}



function init() {
    let operationHeader = document.getElementById('operationHeader')
    let label1 = document.getElementById('labelForm1')
    let label2 = document.getElementById('labelForm2')
    let form = document.querySelector("#operationForm > form:first-of-type")

const operations = document.querySelectorAll('#pointAddition, #pointMultiplication');

document.getElementById('pointAddition').addEventListener('click', (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

        Array.from(operations).forEach((buttons) => {
            if (buttons.disabled === true) {
                // eslint-disable-next-line no-param-reassign
                buttons.disabled = false;
            }
        });

    operationHeader.innerHTML = "Point addition";
    label1.innerHTML = "Index of 1st point:"
    label2.innerHTML = "Index of 2nd point:"
    form.removeAttribute('scalarForm')
    form.setAttribute('id', 'additionForm')




        e.target.disabled = true;
    });

document.getElementById('pointMultiplication').addEventListener('click', (e) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

        Array.from(operations).forEach((buttons) => {
            if (buttons.disabled === true) {
                // eslint-disable-next-line no-param-reassign
                buttons.disabled = false;
            }
        });

    operationHeader.innerHTML = "Point multiplication";
    label1.innerHTML = "Index of point:"
    label2.innerHTML = "Scalar to multiply"
    form.removeAttribute('additionForm')
    form.setAttribute('id', 'scalarForm')
    




        e.target.disabled = true;
    });
}

function drawLineSvg(point1, point2, color = "black") {
    let svg = document.getElementById("lineSVG");
    var svgns = "http://www.w3.org/2000/svg";
    var line = document.createElementNS(svgns, 'line');
    //circle.style.pointerEvents = 'none' // TODO: Maybe remove later
    line.setAttributeNS(null, 'x1', `${point1.getAttribute('cx')}`);
    line.setAttributeNS(null, 'y1', `${point1.getAttribute('cy')}`);
    line.setAttributeNS(null, 'x2', `${point2.getAttribute('cx')}`);
    line.setAttributeNS(null, 'y2', `${point2.getAttribute('cy')}`);                                                            //(canvas.height / (curve.fieldOrder * 1.2)) <= 5 ? (canvas.height / (curve.fieldOrder * 1.2)) : 5)
    line.setAttributeNS(null, 'class', `stroke-${color} .line`);
    svg.appendChild(line);
}

function drawLineSvg1(x1, x2, y1, y2, size, color = "black") {
    let svg = document.getElementById("lineSVG");
    var svgns = "http://www.w3.org/2000/svg";
    var line = document.createElementNS(svgns, 'line');
    //let lines = document.querySelectorAll(".line");
//
    //lines.forEach(line => {
    //    line.remove();
    //});


    //circle.style.pointerEvents = 'none' // TODO: Maybe remove later
    line.setAttributeNS(null, 'x1', `${x1 * (canvas.width / size)}`);
    line.setAttributeNS(null, 'y1', `${canvas.height - y1 * (canvas.height / size)}`);
    line.setAttributeNS(null, 'x2', `${x2 * (canvas.width / size)}`);
    line.setAttributeNS(null, 'y2', `${canvas.height - y2 * (canvas.height / size)}`);                                                            //(canvas.height / (curve.fieldOrder * 1.2)) <= 5 ? (canvas.height / (curve.fieldOrder * 1.2)) : 5)
    line.setAttributeNS(null, 'class', `stroke-${color} .line`);
    svg.appendChild(line);
}



function pointAdditionSteps(points) {


    //const lambda = twoDecimalRound(Mod((points.point1.y - points.point2.y) * inversePrime((points.point1.x - points.point2.x)), curve.mod))
    const lambda = points.point3.alfa
    const stepRows = document.getElementsByClassName('steps');
    let delta = (!(points.point1 == points.point2))?(points.point1.x - points.point2.x):(2 * points.point1.y);
    // -7 % 17 = 10... inverse til 10 = 12 (highlight). Derefter gang 12 med det man fik til venstre, og så mod 17
    if(Number(delta) < 0) {
        console.log('negative')
        delta = Mod(delta, curve.mod);
    }
    
    document.getElementById('explanationExpand').setAttribute('id', delta)


    if(points.point1 === points.point2) {
        stepRows[0].innerHTML = `As \\(P = Q\\), the slope \\(m\\) is calculated by: <br>
                                \\(m = (3x^2_p) \\cdot (2y_p)^{-1} \\cdot (x_P - x_Q)^{-1} \\mod p = \\frac{${points.point1.y} - ${points.point2.y}}{${points.point1.x} - ${points.point2.x}} = \\underline{${lambda}}\\)`;
    
        stepRows[1].innerHTML = `The equations for point addition are similar to the equations in the infinite field, except we need to add \\(mod p)\\) at the end of the expression. \\(P + Q = R\\) is calculated by: <br>
                                \\(x_R = (m^2 - x_P - x_Q) \\mod p = (${lambda}^2 - ${points.point1.x} - ${points.point2.x} = \\underline{${points.point3.x})\\) <br>
                                \\(y_R = y_P + m(x_R - x_P) = ${points.point1.y} + ${lambda}(${points.point3.x} - ${points.point1.x}) = \\underline{${points.point3.y}}\\) <br> Hence:  <br>
                                \\(\\textbf{R = (${points.point3.x}, ${points.point3.y})}\\)`;
    
                                //\\(\\textbf{-R = (${newX}, ${-newY})}\\)`;
    
        // eslint-disable-next-line no-undef

    } else {
        stepRows[0].innerHTML = `As \\(P \\neq Q\\), the slope \\(m\\) is calculated by: <br>
                                \\(m = (y_P - y_Q) \\cdot (x_P - x_Q)^{-1} \\mod p = (${points.point1.y} - ${points.point2.y}) \\cdot (${points.point1.x} - ${points.point2.x})^{-1} = \\underline{${lambda}}\\) <br>
                                Where \\((${points.point1.x} - ${points.point2.x})^{-1}\\) corresponds to calculating the inverse prime of the sum within the parentheses. <br>`;
        if(points.point1.x - points.point2.x < 0) {
            stepRows[0].innerHTML += `<br>Calculating the inverse prime: As \\(${points.point1.x} - ${points.point2.x} = ${points.point1.x - points.point2.x} \\) (a negative number), \\(${points.point1.x - points.point2.x} \\mod ${curve.mod} = ${delta}\\) is calculated. <br>`;
        }

        stepRows[0].innerHTML += `Then, in the multiplicative table the inverse prime can be found by iterating rows \\(0 - ${curve.mod - 1}\\) from column \\(${delta}\\) until the entry with value \\(1\\) is found, then the inverse prime is the row to the entry, i.e. \\(${points.point3.alfa}\\). <br>`;

        stepRows[0].innerHTML += `<button id="additionTable" class="bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow block items-center">
                                    Show Additive Table
                                </button>`

    
        stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a third point -\\(R = (x_R, y_R)\\), where: <br>
                                \\(x_R = (m^2 - x_P - x_Q) \\mod p = (${lambda}^2 - ${points.point1.x} - ${points.point2.x}) \\mod ${curve.mod} = \\underline{${points.point3.x}}\\) <br>
                                \\(y_R = (-y_P + m(x_P - x_R)) \\mod p = (${-points.point1.y} + ${lambda} \\cdot (${-points.point1.x} - ${points.point3.x})) \\mod ${curve.mod} = \\underline{${points.point3.y}}\\) <br> Hence:  <br>
                                \\(\\textbf{R = (${points.point3.x}, ${points.point3.y})}\\)`;

    
                                //\\(\\textbf{-R = (${newX}, ${-newY})}\\)`;
    
        // eslint-disable-next-line no-undef
    }

    


    checkExplanationDisplay();

}

