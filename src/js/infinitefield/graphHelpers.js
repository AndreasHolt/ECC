import { twoDecimalRound } from './realsAddition';

function isOnPage(element) {
    return (element === document.body) ? false : document.body.contains(element);
}

function checkExplanationDisplay() {
    const container = document.getElementById('explanationContainer');
    if (!(container.style.display === 'none')) {
        MathJax.typeset();
    }
}

function moveSection(id, x, y) {
    const el = document.getElementById(id);

    if (!y) return;

    if (el) {
        el.setAttribute('cx', x);
        el.setAttribute('cy', y);
    }
}

function mouseToGraph(rGraph, mouseX, mouseY) {
    const x = (rGraph.centerX - rGraph.offsetLeft) + mouseX - rGraph.maxX * rGraph.scaleX;
    const y = (rGraph.centerY - rGraph.offsetTop) + mouseY - rGraph.maxY * rGraph.scaleY;
    return { x, y };
}

function convertToXY(point) {
    return { x: point[0], y: point[1] };
}

function graphToCoords(rGraph, point) {
    const x = (point.x - rGraph.centerX) / rGraph.scaleX;
    const y = (point.y - rGraph.centerY) / rGraph.scaleY;

    return { x, y };
}

function movePoint(event, rGraph) {
    const mousePos = mouseToGraph(rGraph, event.clientX, event.clientY);
    const coords = graphToCoords(rGraph, mousePos);

    if (mousePos.y > rGraph.centerY) {
        moveSection('point', mousePos.x, rGraph.centerY - (-rGraph.equationP(coords.x) * rGraph.scaleY));
    } else {
        moveSection('point', mousePos.x, rGraph.centerY - (rGraph.equationP(coords.x) * rGraph.scaleY));
    }
}

function getXY(el) {
    const x = parseFloat(el.getAttribute('cx'));
    const y = parseFloat(el.getAttribute('cy'));
    return { x, y };
}

function coordsToGraph(rGraph, coordsX, coordsY) {
    const x = rGraph.centerX + (coordsX * rGraph.scaleX);
    const y = rGraph.centerY + (coordsY * rGraph.scaleY);
    return { x, y };
}

function getPointPlacement(rGraph, x) {
    const points = document.getElementsByClassName('workingPoints');

    const x1 = (getXY(points[0]).x - rGraph.centerX) / rGraph.scaleX;
    const x2 = (getXY(points[1]).x - rGraph.centerX) / rGraph.scaleX;

    let returnValue;

    if ((x > x1) && (x > x2)) {
        returnValue = 1;
    } else if ((x1 >= x && x2 <= x) || (x1 <= x && x2 >= x)) {
        returnValue = 2;
    } else if (x1 >= x && x2 >= x) {
        returnValue = 3;
    }

    return returnValue;
}

function logicPointAddition(rGraph, x) {
    const pointDecider = getPointPlacement(rGraph, x);
    if (pointDecider === 1) {
        const tempPoint = document.getElementsByClassName('workingPoints');

        if (tempPoint[0].getAttribute('cx') > tempPoint[1].getAttribute('cx')) {
            return tempPoint[1];
        }

        return tempPoint[0];
    } if (pointDecider === 2) {
        return document.getElementsByClassName('workingPoints')[0];
    } if (pointDecider === 3) {
        const tempPoint = document.getElementsByClassName('workingPoints');

        if (tempPoint[0].getAttribute('cx') > tempPoint[1].getAttribute('cx')) {
            return tempPoint[0];
        }

        return tempPoint[1];
    }

    return null;
}

function drawLine(rGraph, operator, color, i, x, y, svg, pointOperation) {
    let fromPoint;
    let pointDecider = 0;
    if (pointOperation === 1) {
        fromPoint = logicPointAddition(rGraph, x);
        pointDecider = getPointPlacement(rGraph, x);
    } else if (pointOperation === 2) {
        // eslint-disable-next-line prefer-destructuring
        fromPoint = document.getElementsByClassName('workingPoints')[0];
    }
    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    if (i === 0) {
        newLine.setAttribute('x1', fromPoint.getAttribute('cx'));
        newLine.setAttribute('y1', fromPoint.getAttribute('cy'));
    } else {
        newLine.setAttribute('x1', (x * rGraph.scaleX) + rGraph.centerX);
        newLine.setAttribute('y1', (-y * rGraph.scaleY) + rGraph.centerY);
    }
    if (pointOperation === 1 && i === 0 && pointDecider === 2) {
        const secondPoint = document.getElementsByClassName('workingPoints')[1];
        newLine.setAttribute('x2', secondPoint.getAttribute('cx'));
        newLine.setAttribute('y2', secondPoint.getAttribute('cy'));
    } else {
        newLine.setAttribute('x2', (x * rGraph.scaleX) + rGraph.centerX);
        newLine.setAttribute('y2', ((((operator === '-') ? (y) : (y)) * rGraph.scaleY) + rGraph.centerY));
    }
    newLine.classList.add('linesConnecting');
    newLine.setAttribute('stroke', color);
    newLine.setAttribute('stroke-width', '2');

    svg.appendChild(newLine);
}

function addTextToPoints(rGraph, pointC, i) {
    let textNode;
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const point1 = coordsToGraph(rGraph, pointC.x, pointC.y);
    const point2 = coordsToGraph(rGraph, pointC.x, -pointC.y);

    if (i === 0) {
        circle.setAttributeNS(null, 'cy', point1.y);
        circle.classList.add('pointMinusR');

        textEl.setAttribute('y', point1.y);
        textNode = document.createTextNode('-R');
        textEl.classList.add('pointMinusR');
    } else if (i === 1) {
        circle.setAttributeNS(null, 'cy', point2.y);
        circle.classList.add('pointR');

        textEl.setAttribute('y', point2.y);
        textNode = document.createTextNode('R');
        textEl.classList.add('pointR');
    } else if (i === 2) {
        circle.setAttributeNS(null, 'cy', point2.y);
        circle.classList.add('pointP');

        textEl.setAttribute('y', point2.y);
        textNode = document.createTextNode('P');
        textEl.classList.add('pointP');
    } else {
        circle.setAttributeNS(null, 'cy', point1.y);
        circle.classList.add('pointQ');

        textEl.setAttribute('y', point1.y);
        textNode = document.createTextNode('Q');
        textEl.classList.add('pointQ');
    }

    circle.setAttributeNS(null, 'r', 12);
    circle.setAttributeNS(null, 'style', 'fill: lightgray;');
    circle.setAttributeNS(null, 'cx', point1.x);
    circle.classList.add('textLabel');

    textEl.setAttribute('x', point1.x);
    textEl.setAttribute('fill', 'white');
    textEl.setAttribute('dominant-baseline', 'middle');
    textEl.setAttribute('text-anchor', 'middle');
    textEl.classList.add('textLabel');
    textEl.classList.add('text-xl');

    textEl.appendChild(textNode);

    document.getElementById('pointText').appendChild(circle);
    document.getElementById('pointText').appendChild(textEl);
}

function addCalculatedPoint(rGraph, point, pointOperation) {
    document.querySelectorAll('.calculatedPoints, .linesConnecting').forEach((el) => {
        el.remove();
    });

    let arrayIntersectInverted;

    if (pointOperation === 3) {
        arrayIntersectInverted = [point.y];
    } else {
        arrayIntersectInverted = [point.y, -point.y];
    }

    for (let i = 0; i < arrayIntersectInverted.length; i += 1) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        if (i === 0) {
            circle.setAttribute('fill', 'orange');
        } else {
            circle.setAttribute('fill', 'fuchsia');
        }

        const pointG = coordsToGraph(rGraph, point.x, -arrayIntersectInverted[i]);

        circle.setAttribute('cx', pointG.x);
        circle.setAttribute('cy', pointG.y);
        circle.classList.add('calculatedPoints');
        circle.setAttribute('r', 5);

        const svg = document.querySelector('svg');
        svg.appendChild(circle);

        if (i === 0 && pointOperation !== 3) {
            drawLine(rGraph, '+', 'fuchsia', i, point.x, point.y, svg, pointOperation);
        } else if (pointOperation !== 3) {
            drawLine(rGraph, '-', 'orange', i, point.x, point.y, svg, pointOperation);
        }

        if (pointOperation === 3) {
            addTextToPoints(rGraph, point, i + 1);
        } else {
            addTextToPoints(rGraph, point, i);
        }
    }

    document.getElementById('Rx').value = `${twoDecimalRound(point.x)}`;
    document.getElementById('Ry').value = `${twoDecimalRound(point.y)}`;
    document.getElementById('negRx').value = `${twoDecimalRound(point.x)}`;
    document.getElementById('negRy').value = `${-twoDecimalRound(point.y)}`;
}

function addPointOnClick(rGraph) {
    const point = document.getElementById('point');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('fill', 'red');
    circle.setAttribute('cx', point.getAttribute('cx'));
    circle.setAttribute('cy', point.getAttribute('cy'));
    circle.classList.add('workingPoints');
    circle.setAttribute('r', 5);
    circle.setAttribute('idPoint', (document.getElementsByClassName('workingPoints').length === 1) ? 'P' : 'Q');
    const svg = document.querySelector('svg');
    svg.appendChild(circle);

    if (document.getElementsByClassName('workingPoints').length === 1) {
        document.getElementById('Px').value = `${twoDecimalRound((point.getAttribute('cx') - rGraph.centerX) / rGraph.scaleX)}`;
        document.getElementById('Py').value = `${twoDecimalRound(-(point.getAttribute('cy') - rGraph.centerY) / rGraph.scaleY)}`;

        addTextToPoints(rGraph, { x: (point.getAttribute('cx') - rGraph.centerX) / rGraph.scaleX, y: -(point.getAttribute('cy') - rGraph.centerY) / rGraph.scaleY }, 2);
    } else if (document.getElementsByClassName('workingPoints').length === 2) {
        document.getElementById('Qx').value = `${twoDecimalRound((point.getAttribute('cx') - rGraph.centerX) / rGraph.scaleX)}`;
        document.getElementById('Qy').value = `${twoDecimalRound(-(point.getAttribute('cy') - rGraph.centerY) / rGraph.scaleY)}`;

        addTextToPoints(rGraph, { x: (point.getAttribute('cx') - rGraph.centerX) / rGraph.scaleX, y: (point.getAttribute('cy') - rGraph.centerY) / rGraph.scaleY }, 3);
    }
}

function addPointByInput(idX, rGraph) {
    const x = document.getElementById(idX).value;
    const y = document.getElementById(`${idX[0]}y`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('fill', 'red');
    circle.setAttribute('cx', rGraph.centerX + (x * rGraph.scaleX));
    circle.setAttribute('cy', rGraph.centerY + (rGraph.scaleY * -rGraph.equationP(x)));
    circle.classList.add('workingPoints');
    circle.setAttribute('r', 5);
    circle.setAttribute('idPoint', `${idX[0]}`);

    document.getElementById(idX).value = `${twoDecimalRound(x)}`;
    y.value = `${twoDecimalRound(rGraph.equationP(x))}`;
    const svg = document.querySelector('svg');
    svg.appendChild(circle);

    if (idX === 'Px') {
        addTextToPoints(rGraph, { x: (circle.getAttribute('cx') - rGraph.centerX) / rGraph.scaleX, y: -(circle.getAttribute('cy') - rGraph.centerY) / rGraph.scaleY }, 2);
    } else if (idX === 'Qx') {
        addTextToPoints(rGraph, { x: (circle.getAttribute('cx') - rGraph.centerX) / rGraph.scaleX, y: (circle.getAttribute('cy') - rGraph.centerY) / rGraph.scaleY }, 3);
    }
}

function addPointToEdgeCase(idX, sign, rGraph) {
    const x = document.getElementById(idX).value;
    const y = document.getElementById(`${idX[0]}y`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('fill', 'red');
    circle.setAttribute('cx', rGraph.centerX + (x * rGraph.scaleX));
    circle.setAttribute('cy', rGraph.centerY + (rGraph.scaleY * ((sign === '+') ? (rGraph.equationP(x)) : (-rGraph.equationP(x)))));
    circle.classList.add('workingPoints');
    circle.setAttribute('r', 5);
    circle.setAttribute('idPoint', `${idX[0]}`);

    document.getElementById(idX).value = `${twoDecimalRound(x)}`;
    y.value = `${twoDecimalRound((sign === '+') ? (rGraph.equationP(x)) : (-rGraph.equationP(x)))}`;
    const svg = document.querySelector('svg');
    svg.appendChild(circle);

    if (idX === 'Px') {
        addTextToPoints(rGraph, { x: (circle.getAttribute('cx') - rGraph.centerX) / rGraph.scaleX, y: -(circle.getAttribute('cy') - rGraph.centerY) / rGraph.scaleY }, 2);
    } else if (idX === 'Qx') {
        addTextToPoints(rGraph, { x: (circle.getAttribute('cx') - rGraph.centerX) / rGraph.scaleX, y: (circle.getAttribute('cy') - rGraph.centerY) / rGraph.scaleY }, 3);
    }
}

function removeBinaryParagraphs() {
    if (document.getElementsByClassName('paragraphBinary')) {
        const paragraphs = document.getElementsByClassName('paragraphBinary');
        for (let i = 0; i < paragraphs.length; i += 1) {
            paragraphs[i].remove();
        }
    }
}

export {
    movePoint, moveSection, mouseToGraph, convertToXY, graphToCoords, coordsToGraph,
    getPointPlacement, addCalculatedPoint, logicPointAddition, drawLine, addPointOnClick,
    getXY, addPointByInput, removeBinaryParagraphs, checkExplanationDisplay, isOnPage, addPointToEdgeCase,
};
