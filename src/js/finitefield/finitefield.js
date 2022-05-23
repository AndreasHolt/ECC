import {
    multiplicativeXOR, additiveXOR,
} from './gf2';
import { Mod } from './bits';
import {
    listPoints, Curve, calcDiscriminant, calcDiscriminantGF2,
} from './curves';
import { addField, inversePrime, multiplyField } from './gfp';
import { checkExplanationDisplay, isOnPage } from '../infinitefield/graphHelpers';
import FiniteField from './finiteFieldVisual';

const finiteField = new FiniteField();
finiteField.addCanvas(document.getElementById('curveGraph'));
finiteField.addHighlightSVG(document.getElementById('highlightSVG'));
finiteField.addLineSVG(document.getElementById('lineSVG'));

const newCalculatedPoints = [];
function toggleTable(curve, bool) {
    if (isOnPage(document.getElementById('multiplicative'))) {
        document.getElementById('multiplicative').remove();
        document.getElementById('multiplicationTableButton').innerHTML = 'Show Multiplicative Table';
    } else if (bool === 1) { // If 1 is passed as the value of the argument, then a table should also be created.
        const arrayValues = createTable(curve.fieldOrder, curve.mod, { mode: 'multiplicative' });
        createTableHTML(curve, arrayValues, curve.fieldOrder, 'multiplicative', 'outputTableMultiplication', 'color');
        document.getElementById('multiplicationTableButton').innerHTML = 'Hide Multiplicative Table';
    }
}

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

    if (document.getElementById('pointAddition').disabled) {
        document.getElementById('multiplicationTableButton').addEventListener('click', () => {
            // TODO remove event listener for the other if active?
            toggleTable(finiteField.curve, 1);
        });
    }
});

init();

document.querySelector('#form').addEventListener('submit', (event) => {
    deleteDrawing();
    event.preventDefault();
    let prime;
    let power;
    let modoli;
    let discriminant;

    document.querySelectorAll('circle').forEach((el) => {
        el.remove();
    });

    const a = Number(event.target.a.value);
    const b = Number(event.target.b.value);
    let c = 0;
    let d = 0;

    switch (event.target.curveList.value) {
    case ('Prime 5'):
        prime = 5;
        power = 1;
        modoli = 5;
        break;
    case ('Prime 17'):
        prime = 17;
        power = 1;
        modoli = 17;
        break;
    case ('Prime 37'):
        prime = 37;
        power = 1;
        modoli = 37;
        break;
    case ('Prime 131'):
        prime = 131;
        power = 1;
        modoli = 131;
        break;
    case ('Prime 257'):
        prime = 257;
        power = 1;
        modoli = 257;
        break;
    case ('GF2 4'):
        prime = 2;
        power = 4;
        modoli = 19;
        break;
    case ('GF2 5'):
        prime = 2;
        power = 5;
        modoli = 37;
        break;
    case ('GF2 8'):
        prime = 2;
        power = 8;
        modoli = 285;
        break;
    default:
        throw new Error('Error 109');
    }

    if (event.target.curveList.value.includes('GF')) {
        c = Number(event.target.c.value);
        d = Number(event.target.d.value);
        discriminant = calcDiscriminantGF2(a, b, c, d, modoli);
    } else {
        discriminant = calcDiscriminant(a, b, c, d);
    }

    try {
        if (discriminant === 0) {
            throw new Error('Discriminant is 0, please choose another curve');
        }
        if (discriminant === null) {
            throw new Error('Discriminant is null');
        }
    } catch (error) {
        alert(error);
    }
    finiteField.addCurve(new Curve(a, b, c, d, prime ** power, modoli));
    finiteField.curve.createPoints();
    drawPoints(finiteField.canvas, finiteField.curve, finiteField.curve.points, finiteField.curve.fieldOrder);

    document.getElementById('parameters').innerHTML = `2. Pick curve parameters: \\((y^2 = x^3 + ${a}x + ${b}) \\mod ${finiteField.curve.mod} \\)`;
    MathJax.typeset();
});

function clearClickedPoints() {
    const circles = document.querySelectorAll('circle');
    // console.log(document.querySelectorAll('circle'));

    circles.forEach((circle) => {
        if (!circle.classList.contains('clickedPoint')) {
            circle.setAttributeNS(null, 'style', 'fill: rgb(59,129,246); stroke: rgb(59,129,246); stroke-width: 1px;');
        } else if (circle.hasAttribute('pointerEvents')) {
            circle.remove();
        }
    });
}

function clearLines() {
    const lines = document.querySelectorAll('.line');

    lines.forEach((line) => {
        line.remove();
    });
}

function deleteDrawing(bool) {
    clearLines();

    if (isOnPage(document.getElementById('calculatedPoint'))) {
        document.getElementById('calculatedPoint').remove();
    }

    newCalculatedPoints.forEach((point) => {
        point.remove();
    });

    // If 1 is passed as the argument, the clicked points are also removed (converted to their original state)
    if (bool === 1) {
        const clickedPoints = document.querySelectorAll('.clickedPoint');

        for (let i = 0; i < clickedPoints.length; i += 1) {
            clickedPoints[i].setAttributeNS(null, 'style', 'fill: rgb(59,129,246); stroke: rgb(59,129,246); stroke-width: 1px;');
        }

        clickedPoints.forEach((point) => point.classList.remove('clickedPoint'));
    }
}

function pointAdditionFinite(canvas, curve, index1, index2) {
    deleteDrawing(0);
    toggleTable(curve, 0);

    try {
        const point1 = curve.points[index1];
        const point2 = curve.points[index2];
        const options = {};
        if (curve.mod === curve.fieldOrder) {
            options.prime = true;
        } else {
            options.prime = false;
        }

        const newPoint = curve.calcPointAddition(point1, point2);
        // newCalculatedPoints.push(
        const yellowPoint = drawPointElement(canvas, curve, newPoint, curve.fieldOrder, 5, 'yellow', true);
        yellowPoint.style.pointerEvents = 'none';
        yellowPoint.setAttribute('id', 'calculatedPoint');
        // );

        highlightPointTimeout(canvas, newPoint, 5, curve.fieldOrder);
        newCalculatedPoints.push(drawPointElement(canvas, curve, point1, curve.fieldOrder, 5, 'red', true));
        newCalculatedPoints.push(drawPointElement(canvas, curve, point2, curve.fieldOrder, 5, 'red', true));

        newCalculatedPoints.push(drawPointElement(canvas, curve, newPoint, curve.fieldOrder, 5, 'fuchsia', true));
        newCalculatedPoints[newCalculatedPoints.length - 1].style.pointerEvents = 'none';

        const listedPoints = listPoints(point1, point2, newPoint); // NEEDS TO PASS THE INVERSE_OF_POINT

        pointAdditionSteps(curve, listedPoints);

        if (index1 !== index2) {
            finiteField.drawLineDirect(point1, point2, newPoint, 5);
        }
        // finiteField.drawLineDirectGood(point1, newPoint, {"prime": curve.fieldOrder == curve.mod ? true : false});
    } catch (e) {
        console.log('Error! find selv ud af det!');
        console.log(e);
    }
}

document.getElementById('additionForm').addEventListener('submit', (event) => {
    // console.log('HelloAddition');

    event.preventDefault();
    const index1 = Number(event.target.index1.value);
    const index2 = Number(event.target.index2.value);
    pointAdditionFinite(finiteField.canvas, finiteField.curve, index1, index2);
});

function addScalarForm(canvas, curve) {
    document.getElementById('scalarForm').addEventListener('submit', (event) => {
        // console.log('HelloScalar');
        deleteDrawing(0);
        event.preventDefault();
        const index = Number(event.target.index1.value);
        const point = curve.points[index];
        const scale = Number(event.target.index2.value);
        drawPoint(canvas, point, curve.fieldOrder, 5, 'blue');

        if (point) {
            const scaledPoint = curve.calcPointMultiplication(scale, point);
            drawPoint(canvas, scaledPoint, curve.fieldOrder, 5, 'red');
            finiteField.drawLineDirectGood(canvas, curve, point, scaledPoint, { prime: curve.fieldOrder == curve.mod });
            drawPointMultiplication(canvas, curve, index, scale);
        }
    });
}

function drawPoints(canvas, curve, arrayPoints, fieldOrder) {
    const pointSize = canvas.width / (fieldOrder * 1.25) < 5 ? canvas.width / (fieldOrder * 1.25) : 5;

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    for (const point of arrayPoints) {
        drawPointElement(canvas, curve, point, fieldOrder, pointSize, 'rgb(59,129,246)');
    }
}

function drawPoint(canvas, point, size, pointSize, color) {
    // console.log("Hello1");
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(point.x * canvas.width / size, canvas.height - (point.y * canvas.height / size), pointSize, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function highlightPointTimeout(canvas, point, time, size) {
    const svg = document.getElementById('highlightSVG');
    const svgns = 'http://www.w3.org/2000/svg';
    const circle = document.createElementNS(svgns, 'circle');
    const x = point.x * canvas.width / size;
    const y = canvas.height - (point.y * canvas.height / size);
    if (point.x === Infinity) {
        circle.setAttributeNS(null, 'cx', canvas.width);
        circle.setAttributeNS(null, 'cy', 0);
    } else {
        circle.setAttributeNS(null, 'cx', x);
        circle.setAttributeNS(null, 'cy', y);
    }
    circle.setAttributeNS(null, 'r', 10);
    circle.setAttributeNS(null, 'style', 'fill: none; stroke: rgb(59 130 246); stroke-width: 1.5px;');
    circle.style.zIndex = '50000';
    svg.appendChild(circle);
    setTimeout(() => {
        svg.removeChild(circle);
    }, time);
}

// function highlightPoint(canvas, point, size) {
//     const svg = document.getElementById('highlightSVG');
//     const svgns = 'http://www.w3.org/2000/svg';
//     const circle = document.createElementNS(svgns, 'circle');
//     circle.setAttributeNS(null, 'cx', point.x * canvas.width / size);
//     circle.setAttributeNS(null, 'cy', canvas.height - (point.y * canvas.height / size));
//     circle.setAttributeNS(null, 'r', 10);
//     circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;');
//     svg.appendChild(circle);
//     return circle;
// }

function pointDescription(curve, point) {
    let negation = { x: point.x, y: point.y }; // If unable to find negation use ifself
    let subGroupPoint = { x: point.x, y: point.y }; // virker ikke
    const subGroup = [];
    let orderOfSubGroup = 0;
    if (point.x === Infinity) {
        return { negation, subGroup, orderOfSubGroup: orderOfSubGroup - 2 };
    }

    if (curve.mod === curve.fieldOrder) {
        negation.y = (curve.fieldOrder - point.y) % curve.fieldOrder;
    } else {
        for (const i of curve.points) {
            if (i.x === point.x && i.y !== point.y) {
                negation = i;
            }
        }
    }

    while (subGroupPoint.x !== negation.x || subGroupPoint.y !== negation.y) {
        subGroupPoint = curve.calcPointAddition(subGroupPoint, point);
        subGroup[orderOfSubGroup] = subGroupPoint;
        orderOfSubGroup += 1;
    }

    return { negation, subGroup, orderOfSubGroup };
}

function drawPointElement(canvas, curve, point, size, pointSize, color, temp = false) {
    if (newCalculatedPoints.length !== 0) {
        newCalculatedPoints.forEach((nPoint) => {
            nPoint.remove();
        });
    }

    const svg = document.getElementById('highlightSVG');
    const svgns = 'http://www.w3.org/2000/svg';
    const circle = document.createElementNS(svgns, 'circle');
    circle.style.pointerEvents = 'none'; // TODO: Maybe remove later

    if (point.x === Infinity) {
        circle.setAttributeNS(null, 'cx', canvas.width);
        circle.setAttributeNS(null, 'cy', 0);
    } else {
        circle.setAttributeNS(null, 'cx', point.x * canvas.width / size);
        circle.setAttributeNS(null, 'cy', canvas.height - (point.y * canvas.height / size));
    }

    circle.setAttributeNS(null, 'r', pointSize); // (canvas.height / (curve.fieldOrder * 1.2)) <= 5 ? (canvas.height / (curve.fieldOrder * 1.2)) : 5)
    circle.setAttributeNS(null, 'style', `fill: ${color}; stroke: ${color}; stroke-width: 1px;`);
    svg.appendChild(circle);

    circle.addEventListener('click', () => {
        const circles = document.querySelectorAll('circle');

        canvas.getContext('2d').clearRect(0, 0, 600, 600);
        const clickedPoints = document.getElementsByClassName('clickedPoint');

        clearClickedPoints();

        const indexOfClickedPoints = [];

        if (document.getElementById('pointAddition').disabled && clickedPoints.length === 2) {
            for (let i = clickedPoints.length - 1; i >= 0; i -= 1) {
                clickedPoints[i].setAttributeNS(null, 'style', 'fill: rgb(59,129,246); stroke: rgb(59,129,246); stroke-width: 1px;');
                clickedPoints[i].classList.remove('clickedPoint');
            }
        } else if (document.getElementById('pointMultiplication').disabled && clickedPoints.length >= 0) {
            for (let i = clickedPoints.length - 1; i >= 0; i -= 1) {
                clickedPoints[i].setAttributeNS(null, 'style', 'fill: rgb(59,129,246); stroke: rgb(59,129,246); stroke-width: 1px;');
                clickedPoints[i].classList.remove('clickedPoint');
            }

            clearLines();

            document.getElementById('index1').value = Number(document.getElementById('index').innerHTML);
        }

        circle.classList.add('clickedPoint');

        if (clickedPoints.length === 2) {
            for (let i = 0; i < curve.points.length; i += 1) {
                if (circles[i].classList.contains('clickedPoint')) {
                    indexOfClickedPoints.push(i);
                }
            }

            pointAdditionFinite(canvas, curve, indexOfClickedPoints[0], indexOfClickedPoints[1]);
        }

        circle.setAttributeNS(null, 'style', 'fill: red; stroke: red; stroke-width: 1px;');
    });

    // Event listener for mouse hover over points on the finite field.
    // Displays description of points hovered etc.

    circle.addEventListener('mouseover', () => {
        const pointDetailArray = pointDescription(curve, point);

        let orderOfSubGroupString = `(${point.x}, ${point.y}), `;
        for (let i = 0; i < pointDetailArray.orderOfSubGroup; i += 1) {
            orderOfSubGroupString += `(${pointDetailArray.subGroup[i].x}, ${pointDetailArray.subGroup[i].y}) → `;
        }

        orderOfSubGroupString += '∞';

        const output = document.getElementById('pointInfo');
        let index;
        curve.points.every((elem, i) => {
            if (elem.x === point.x && elem.y === point.y) {
                index = i;
                return false;
            }

            return true;
        });

        const pointDetails = [`<span class="detailKey">Index:</span> <span id="index">${index}</span>`,
            `<span class="detailKey">Point:</span> (${point.x}, ${point.y})`,
            `<span class="detailKey">Inverse:</span> (${pointDetailArray.negation.x}, ${pointDetailArray.negation.y})`,
            `<span class="detailKey">Subgroup: </span> ${pointDetailArray.orderOfSubGroup + 2}`,
            `<span class="detailKey">Generated sub group: </span> ${orderOfSubGroupString}`];

        output.innerHTML = '';

        for (let i = 0; i < pointDetails.length; i += 1) {
            const p = document.createElement('p');
            output.appendChild(p);
            p.setAttribute('class', 'pointDetails');

            p.innerHTML += pointDetails[i];

            const detailKey = document.getElementsByClassName('detailKey');
            detailKey[i].classList.add('tracking-wide', 'text-gray-700', 'text-x', 'font-bold', 'mb-2');
        }
    });

    circle.addEventListener('mouseover', () => {
        highlightPointTimeout(canvas, point, 400, curve.fieldOrder);
    });

    if (temp) {
        circle.style.pointerEvents = 'none';
    }

    return circle;
}

// function pointText(canvas, curve, point, eq = '') {
//     let textNode;
//     const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

//     textElement.setAttribute('x', point.x * canvas.width / curve.fieldOrder);
//     textElement.setAttribute('y', canvas.height - (point.y * canvas.height / curve.fieldOrder));

//     if (eq) {
//         textNode = document.createTextNode(`${eq}(${point.x}, ${point.y})`);
//     } else {
//         textNode = document.createTextNode(`(${point.x}, ${point.y})`);
//     }

//     textElement.appendChild(textNode);
//     return textElement;
// }

function createTableHTML(curve, tableArray, tableSize, htmlID, outputID, colorBool) {
    const oldTable = document.getElementById(htmlID);
    const newTable = document.createElement('table');
    newTable.id = htmlID;

    newTable.classList.add('border-blue-500', 'max-w-7xl');

    let delta;

    (colorBool === 'color') ? (delta = Number(document.getElementsByClassName('steps')[0].getAttribute('id'))) : (console.log('test2'));
    // console.log('delta:', delta);

    const primeInverse = inversePrime(delta, curve.mod);

    const headerRow = document.createElement('tr');

    for (let i = -1; i < tableSize; i += 1) {
        const header = document.createElement('td');

        if (i !== -1) {
            header.textContent = i;
            header.classList.add('text-sm', 'text-white', 'font-medium', 'px-2', 'py-2', 'whitespace-nowrap');
            if (i === delta) {
                header.classList.add('border-b', 'bg-red-600', 'border-gray-800');
            } else {
                header.classList.add('border-b', 'bg-gray-800', 'border-gray-800');
            }
        } else {
            header.classList.add('border-b', 'bg-gray-800', 'border-gray-800');

            header.classList.add('text-sm', 'text-white', 'font-medium', 'px-6', 'py-6', 'whitespace-nowrap');
            newTable.classList.add('inline-block', 'relative', 'basis-1/2', 'table-fixed');

            if (htmlID === 'multiplicative') {
                header.textContent = '*';
            } else if (htmlID === 'additive') {
                header.textContent = '+';
            }
        }

        headerRow.appendChild(header);
    }

    newTable.appendChild(headerRow);

    // For each row
    for (let rowIndex = 0; rowIndex < tableSize; rowIndex += 1) {
        const row = document.createElement('tr');

        const dataCell = document.createElement('td');
        dataCell.textContent = rowIndex;

        row.appendChild(dataCell);

        if (rowIndex === primeInverse) {
            row.firstChild.classList.add('border-b', 'bg-green-600', 'border-gray-800', 'text-sm', 'text-white', 'font-medium', 'whitespace-nowrap', 'text-center');
        } else {
            row.firstChild.classList.add('border-b', 'bg-gray-800', 'border-gray-800', 'text-sm', 'text-white', 'font-medium', 'whitespace-nowrap', 'text-center');
        }

        // For each column
        for (let i = 0; i < tableSize; i += 1) {
            const dataCell = document.createElement('td'); // TODO Datacell is already defined higher up
            dataCell.classList.add('text-center');
            if (i === delta && rowIndex <= primeInverse) {
                // console.log('lol', rowIndex);
                dataCell.classList.add('bg-blue-400', 'text-white');
            } else if (rowIndex == primeInverse && i < delta) { // TODO Should it be ===
                dataCell.classList.add('bg-blue-400', 'text-white');
            } else if (i % 2 === 0 && rowIndex % 2 === 0) {
                dataCell.classList.add('bg-gray-100');
            } else if (i % 2 !== 0 && rowIndex % 2 === 1) {
                dataCell.classList.add('bg-gray-100');
            }
            dataCell.textContent = tableArray[i][rowIndex];
            dataCell.classList.add('mx-10', 'my-100');
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

function createTable(sizeOfTable, mod, options) {
    let arrayValues = [];
    if (sizeOfTable !== mod) {
        if (options.mode === 'additive') {
            arrayValues = calculateElements(sizeOfTable, mod, additiveXOR);
        } else if (options.mode === 'multiplicative') {
            arrayValues = calculateElements(sizeOfTable, mod, multiplicativeXOR);
        }
    } else if (options.mode === 'additive') {
        arrayValues = calculateElements(sizeOfTable, mod, addField);
    } else if (options.mode === 'multiplicative') {
        arrayValues = calculateElements(sizeOfTable, mod, multiplyField);
    }

    return arrayValues;
}

function calculateElements(size, mod, combinationFunction) {
    const arrayValues = [];
    for (let i = 0; i < size; i += 1) {
        const column = [];
        for (let j = 0; j < size; j += 1) {
            column[j] = combinationFunction(i, j, mod);
        }
        arrayValues[i] = column;
    }
    return arrayValues;
}

// function clmul32(x1, x2, mod) { // https://www.youtube.com/watch?v=v4HKU_VBbqM
//     let result = 0;
//     // x2 |= 0;                            // Kun nødvendig hvis der er chance for at input er double

//     while (x1 !== 0) {
//         result ^= x2 * (x1 & -x1);
//         x1 &= x1 - 1;
//     }

//     return result; //
// }

function init() {
    const operationHeader = document.getElementById('operationHeader');
    const label1 = document.getElementById('labelForm1');
    const label2 = document.getElementById('labelForm2');
    const form = document.querySelector('#operationForm > form:first-of-type');

    const operations = document.querySelectorAll('#pointAddition, #pointMultiplication');

    document.getElementById('pointAddition').addEventListener('click', (e) => {
        deleteDrawing(1);

        Array.from(operations).forEach((buttons) => {
            if (buttons.disabled === true) {
                if (document.getElementById('pointAddition').disabled) {
                    // console.log('Doing point addition');
                } else {
                    document.getElementById('Doing point multiplication');
                }
                buttons.disabled = false;
            }
        });

        operationHeader.innerHTML = 'Point addition';
        label1.innerHTML = 'Index of 1st point:';
        label2.innerHTML = 'Index of 2nd point:';
        form.removeAttribute('scalarForm');
        form.setAttribute('id', 'additionForm');
        e.target.disabled = true;
    });

    document.getElementById('pointMultiplication').addEventListener('click', (e) => {
        deleteDrawing(1);

        Array.from(operations).forEach((buttons) => {
            if (buttons.disabled === true) {
                // eslint-disable-next-line no-param-reassign
                buttons.disabled = false;
            }
        });

        operationHeader.innerHTML = 'Point multiplication';
        label1.innerHTML = 'Index of point:';
        label2.innerHTML = 'Scalar to multiply';
        form.removeAttribute('additionForm');
        form.setAttribute('id', 'scalarForm');
        addScalarForm(finiteField.canvas, finiteField.curve);
        e.target.disabled = true;
    });
}

// function drawLineSvg(point1, point2, color = 'black') {
//     const svg = document.getElementById('lineSVG');
//     const svgns = 'http://www.w3.org/2000/svg';
//     const line = document.createElementNS(svgns, 'line');

//     line.setAttributeNS(null, 'x1', `${point1.getAttribute('cx')}`);
//     line.setAttributeNS(null, 'y1', `${point1.getAttribute('cy')}`);
//     line.setAttributeNS(null, 'x2', `${point2.getAttribute('cx')}`);
//     line.setAttributeNS(null, 'y2', `${point2.getAttribute('cy')}`); // (canvas.height / (curve.fieldOrder * 1.2)) <= 5 ? (canvas.height / (curve.fieldOrder * 1.2)) : 5)
//     line.setAttributeNS(null, 'class', `stroke-${color} .line`);
//     svg.appendChild(line);
// }

function pointAdditionSteps(curve, points) {
    const lambda = points.point3.alfa;
    const stepRows = document.getElementsByClassName('steps');
    let delta = (!(points.point1 == points.point2)) ? (points.point1.x - points.point2.x) : (2 * points.point1.y); // TODO Should it be ===
    if (Number(delta) < 0) {
        // console.log('negative');
        delta = Mod(delta, curve.mod);
    }

    document.getElementsByClassName('steps')[0].setAttribute('id', delta);

    if (points.point1 === points.point2) {
        stepRows[0].innerHTML = `As \\(P = Q\\), the slope \\(m\\) is calculated by: <br>
                                \\(m = (3x^2_p) \\cdot (2y_p)^{-1} \\cdot (x_P - x_Q)^{-1} \\mod p \\equiv \\frac{${points.point1.y} - ${points.point2.y}}{${points.point1.x} - ${points.point2.x}} \\equiv \\underline{${lambda}}\\)`;

        stepRows[1].innerHTML = `The equations for point addition are similar to the equations in the infinite field, except we need to add \\(mod p)\\) at the end of the expression. \\(P + Q = R\\) is calculated by: <br>
                                \\(x_R = (m^2 - x_P - x_Q) \\mod p \\equiv (${lambda}^2 - ${points.point1.x} - ${points.point2.x} \\equiv \\underline{${points.point3.x})\\) <br>
                                \\(y_R = y_P + m(x_R - x_P) = ${points.point1.y} + ${lambda}(${points.point3.x} - ${points.point1.x}) \\equiv  \\underline{${points.point3.y}}\\) <br> Hence:  <br>
                                \\(\\textbf{R = (${points.point3.x}, ${points.point3.y})}\\)`;

        // \\(\\textbf{-R = (${newX}, ${-newY})}\\)`;

        // eslint-disable-next-line no-undef
    } else {
        stepRows[0].innerHTML = `As \\(P \\neq Q\\), the slope \\(m\\) is calculated by: <br>
                                \\(m = (y_P - y_Q) \\cdot (x_P - x_Q)^{-1} \\mod p \\equiv (${points.point1.y} - ${points.point2.y}) \\cdot (${points.point1.x} - ${points.point2.x})^{-1} \\mod ${curve.mod} \\equiv \\underline{${lambda}}\\) <br>
                                Where \\((${points.point1.x} - ${points.point2.x})^{-1}\\) corresponds to calculating the inverse prime of the sum within the parentheses. <br>`;
        if (points.point1.x - points.point2.x < 0) {
            stepRows[0].innerHTML += `<br>Calculating the inverse prime: <br> As \\(${points.point1.x} - ${points.point2.x} = ${points.point1.x - points.point2.x} \\) results in a negative number, \\(${points.point1.x - points.point2.x} \\mod ${curve.mod} \\equiv ${delta}\\) is calculated. <br>`;
        }

        stepRows[0].innerHTML += `In the multiplicative table the inverse prime can be found by iterating rows \\(0 - ${curve.mod - 1}\\) from column \\(${delta}\\) until the entry with value \\(1\\) is found, then the inverse prime is the row to the entry, i.e. \\(${inversePrime(delta, curve.mod)}\\). <br>`;

        stepRows[0].innerHTML += `<button id="multiplicationTableButton" class="bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow block items-center">
                                    Show Multiplicative Table
                                </button>`;

        stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a third point -\\(R = (x_R, y_R)\\), where: <br>
                                \\(x_R = (m^2 - x_P - x_Q) \\mod p \\equiv (${lambda}^2 - ${points.point1.x} - ${points.point2.x}) \\mod ${curve.mod} \\equiv \\underline{${points.point3.x}}\\) <br>
                                \\(y_R = (-y_P + m(x_P - x_R)) \\mod p \\equiv (${-points.point1.y} + ${lambda} \\cdot (${-points.point1.x} - ${points.point3.x})) \\mod ${curve.mod} \\equiv \\underline{${points.point3.y}}\\) <br> Hence:  <br>
                                \\(\\textbf{R = (${points.point3.x}, ${points.point3.y})}\\)`;

        // eslint-disable-next-line no-undef
    }

    document.getElementById('multiplicationTableButton').addEventListener('click', () => {
        // TODO remove event listener for the other if active?
        toggleTable(curve, 1);
    });

    checkExplanationDisplay();
}

function drawPointMultiplication(canvas, curve, index, scalar) {
    let newPoint;

    clearLines();

    drawPointElement(canvas, curve, curve.points[index], curve.fieldOrder, 5, 'red', true);
    for (let i = 2; i < scalar; i += 1) {
        newPoint = curve.calcPointMultiplication(i, curve.points[index]);
        // console.log(newPoint);
        const yellowPoint = drawPointElement(canvas, curve, newPoint, curve.fieldOrder, 5, 'yellow', true);
        yellowPoint.style.pointerEvents = 'none';
        yellowPoint.setAttribute('id', 'calculatedPoint');
    }

    newPoint = curve.calcPointMultiplication(scalar, curve.points[index]);
    finiteField.drawLineDirectGood(canvas, curve, curve.points[index], newPoint, { prime: curve.fieldOrder == curve.mod });
}

// function curveParameters() {
//     const curveList = document.getElementById('curveList');

//     const r = new RegExp(/\d+/g);
//     let max;

//     const a = document.getElementById('a').value;
//     const b = document.getElementById('b').value;

//     /* if (curveList.value.includes("GF")) {
//       let weierstrassCurve = `2. Pick curve parameters: \\(\(y^2 + cxy + dy = x^3 + ax + b\)\\)`;
//       document.getElementById("parameters").innerHTML = weierstrassCurve;
//       document.getElementById("weierstrass").style.display = "block";

//       const power = curveList.value.split(" ")[1];
//       max = Math.pow(curveList.value.match(r)[0], power) - 1;5

//       document.getElementById("a").setAttribute("max", `${max}`);
//       document.getElementById("b").setAttribute("max", `${max}`);
//       document.getElementById("c").setAttribute("max", `${max}`);
//       document.getElementById("d").setAttribute("max", `${max}`);
//       MathJax.typeset();
//     } else { */
//     document.getElementById('weierstrass').style.display = 'none';

//     const generalCurve = `2. Pick curve parameters: \\(\(y^2 = x^3 + ${a}x + ${b}\)\\)`;
//     document.getElementById('parameters').innerHTML = generalCurve;

//     max = curveList.value.match(r)[0] - 1;

//     document.getElementById('a').setAttribute('max', `${max}`);
//     document.getElementById('b').setAttribute('max', `${max}`);

//     MathJax.typeset();

//     // }
// }

/* document.getElementById("power").addEventListener("input", () => {
    if (document.getElementById("power").value > 1) {
        document.getElementById("modoliDiv").hidden = false;
    } else {
        document.getElementById("modoliDiv").hidden = true;
    }
}); */

/* document.getElementById("Scalar").addEventListener("input", (event) => {
    let index = Number(document.getElementById("index").value);
    let point = curve.points[index];
    let scale = Number(event.target.value);
    if (point) {

        let scaledPoint = curve.calcPointMultiplication(scale, point);
        highlightPointTimeout(scaledPoint, 1000, curve.fieldOrder);

    }
}); */
