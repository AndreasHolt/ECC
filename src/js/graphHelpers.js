function moveSection(id, x, y) {
    const el = document.getElementById(id);

    if (!y) return;

    if (el) {
        el.setAttribute('cx', x);
        el.setAttribute('cy', y);
    }
}

function mouseToGraph(myGraph, mouseX, mouseY) {
    const x = (myGraph.centerX - myGraph.offsetLeft) + mouseX - myGraph.maxX * myGraph.scaleX;
    const y = (myGraph.centerY - myGraph.offsetTop) + mouseY - myGraph.maxY * myGraph.scaleY;
    return { x, y };
}

function graphToCoords(myGraph, graphX, graphY) {
    const x = (graphX - myGraph.centerX) / myGraph.scaleX;
    const y = (graphY - myGraph.centerY) / myGraph.scaleY;

    return { x, y };
}

function movePoint(event, myGraph) {
    const mousePos = mouseToGraph(myGraph, event.clientX, event.clientY);
    const coords = graphToCoords(myGraph, mousePos.x, mousePos.y);

    if (mousePos.y > myGraph.centerY) {
        moveSection('point', mousePos.x, myGraph.centerY - (-myGraph.equationP(coords.x) * myGraph.scaleY));
    } else {
        moveSection('point', mousePos.x, myGraph.centerY - (myGraph.equationP(coords.x) * myGraph.scaleY));
    }
}

function coordsToGraph(myGraph, coordsX, coordsY) {
    const x = myGraph.centerX + (coordsX * myGraph.scaleX);
    const y = myGraph.centerY + (coordsY * myGraph.scaleY);
    return { x, y };
}

function getPointPlacement(myGraph, x) {
    const point1 = document.getElementsByClassName('workingPoints')[0];
    const point2 = document.getElementsByClassName('workingPoints')[1];
    const x1 = (point1.getAttribute('cx') - myGraph.centerX) / myGraph.scaleX;
    const x2 = (point2.getAttribute('cx') - myGraph.centerX) / myGraph.scaleX;
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

function logicPointAddition(myGraph, x) {
    const pointDecider = getPointPlacement(myGraph, x);
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

function drawLine(myGraph, operator, color, i, x, y, svg, pointOperation) {
    let fromPoint;
    let pointDecider = 0;
    if (pointOperation === 1) {
        fromPoint = logicPointAddition(myGraph, x);
        pointDecider = getPointPlacement(myGraph, x);
    } else if (pointOperation === 2) {
        // eslint-disable-next-line prefer-destructuring
        fromPoint = document.getElementsByClassName('workingPoints')[0];
    }
    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    if (i === 0) {
        newLine.setAttribute('x1', fromPoint.getAttribute('cx')); // TODO point addition clicking on the same spot causes fromPoint is null!
        newLine.setAttribute('y1', fromPoint.getAttribute('cy'));
    } else {
        newLine.setAttribute('x1', (x * myGraph.scaleX) + myGraph.centerX);
        newLine.setAttribute('y1', (-y * myGraph.scaleY) + myGraph.centerY);
    }
    if (pointOperation === 1 && i === 0 && pointDecider === 2) {
        const secondPoint = document.getElementsByClassName('workingPoints')[1];
        newLine.setAttribute('x2', secondPoint.getAttribute('cx'));
        newLine.setAttribute('y2', secondPoint.getAttribute('cy'));
    } else {
        newLine.setAttribute('x2', (x * myGraph.scaleX) + myGraph.centerX);
        newLine.setAttribute('y2', ((((operator === '-') ? (y) : (y)) * myGraph.scaleY) + myGraph.centerY));
    }
    newLine.classList.add('linesConnecting');
    newLine.setAttribute('stroke', color);
    newLine.setAttribute('stroke-width', '2');

    svg.appendChild(newLine);
}

function addCalculatedPoint(myGraph, x, y, pointOperation) {
    if (document.getElementsByClassName('calculatedPoints').length === 2) {
        document.getElementsByClassName('calculatedPoints')[1].remove();
        document.getElementsByClassName('calculatedPoints')[0].remove();

        document.getElementsByClassName('linesConnecting')[1].remove();
        document.getElementsByClassName('linesConnecting')[0].remove();
    } else if (pointOperation === 3 && document.getElementsByClassName('calculatedPoints').length === 1) {
        document.getElementsByClassName('calculatedPoints')[0].remove();
    }
    const svgNS = 'http://www.w3.org/2000/svg';

    let arrayIntersectInverted;

    if (pointOperation === 3) {
        arrayIntersectInverted = [y];
        console.log('arrayInt');
    } else {
        arrayIntersectInverted = [y, -y];
    }

    for (let i = 0; i < arrayIntersectInverted.length; i += 1) {
        const circle = document.createElementNS(svgNS, 'circle');

        if (i === 0) {
            circle.setAttribute('fill', 'orange');
        } else {
            circle.setAttribute('fill', 'fuchsia');
        }

        circle.setAttribute('cx', (x * myGraph.scaleX) + myGraph.centerX);
        circle.setAttribute('cy', (-arrayIntersectInverted[i] * myGraph.scaleY) + myGraph.centerY);
        circle.classList.add('calculatedPoints');
        circle.setAttribute('r', 5);

        const svg = document.querySelector('svg');
        svg.appendChild(circle);

        if (pointOperation === 3) {
            return 0;
        } if (i === 0) {
            drawLine(myGraph, '+', 'fuchsia', i, x, y, svg, pointOperation);
        } else {
            drawLine(myGraph, '-', 'orange', i, x, y, svg, pointOperation);
        }
    }
}

function addPointOnClick() {
    const point = document.getElementById('point');
    const svgNS = 'http://www.w3.org/2000/svg';

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('fill', 'red');
    circle.setAttribute('cx', point.getAttribute('cx'));
    circle.setAttribute('cy', point.getAttribute('cy'));
    circle.classList.add('workingPoints');
    circle.setAttribute('r', 5);

    const svg = document.querySelector('svg');
    svg.appendChild(circle);
}

function addPointByInput(idX, myGraph) {
    console.log('Test1')
    const svgNS = 'http://www.w3.org/2000/svg';
    const x = document.getElementById(idX).value;
    let y = document.getElementById(idX[0] + 'y')
    console.log('Test2')

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('fill', 'red');
    circle.setAttribute('cx', myGraph.centerX + (x * myGraph.scaleX));
    circle.setAttribute('cy', myGraph.centerY + (myGraph.scaleY * -myGraph.equationP(x)));
    circle.classList.add('workingPoints');
    circle.setAttribute('r', 5);

    y.value = `${myGraph.equationP(x)}`
    const svg = document.querySelector('svg');
    svg.appendChild(circle);
    console.log('Test3')

}

export {
    movePoint, moveSection, mouseToGraph, graphToCoords, coordsToGraph, getPointPlacement, addCalculatedPoint, logicPointAddition, drawLine, addPointOnClick, addPointByInput
};
