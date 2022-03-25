Graph.prototype.movePoint = function (event) {
    const mousePos = this.mouseToGraph(event.clientX, event.clientY);
    const coords = this.graphToCoords(mousePos.x, mousePos.y);

    if (mousePos.y > this.centerY) {
        this.moveSection('point', mousePos.x, this.centerY - (-myGraph.equationP(coords.x) * this.scaleY));
    } else {
        this.moveSection('point', mousePos.x, this.centerY - (myGraph.equationP(coords.x) * this.scaleY));
    }
};

Graph.prototype.moveSection = function (id, x, y) {
    const el = document.getElementById(id);

    if (!y) return;

    if (el) {
        el.setAttribute('cx', x);
        el.setAttribute('cy', y);
    }
};

Graph.prototype.mouseToGraph = function (mouseX, mouseY) { // this.maxX and y
    const x = (this.centerX - this.offsetLeft) + mouseX - this.maxX * this.scaleX;
    const y = (this.centerY - this.offsetTop) + mouseY - this.maxY * this.scaleY;
    return { x, y };
};

Graph.prototype.graphToCoords = function (graphX, graphY) {
    const x = (graphX / this.scaleX) - this.rangeX / 2;
    const y = (graphY / this.scaleY) - this.rangeY / 2;

    return { x, y };
};

Graph.prototype.coordsToGraph = function (coordsX, coordsY) {
    // x = this.centerX - coordsX
    // y = this.centerY - coordsY
    const x = this.centerX + (coordsX * this.scaleX);
    const y = this.centerY + (coordsY * this.scaleY);
    return { x, y };
};

Graph.prototype.getPointPlacement = function (x) {
    const point1 = document.getElementsByClassName('workingPoints')[0];
    const point2 = document.getElementsByClassName('workingPoints')[1];
    const x1 = (point1.getAttribute('cx') - this.centerX) / this.scaleX;
    const x2 = (point2.getAttribute('cx') - this.centerX) / this.scaleX;
    let returnValue;

    if ((x > x1) && (x > x2)) {
        returnValue = 1;
    } else if ((x1 >= x && x2 <= x) || (x1 <= x && x2 >= x)) {
        returnValue = 2;
    } else if (x1 >= x && x2 >= x) {
        returnValue = 3;
    }
    return returnValue;
};

Graph.prototype.addCalculatedPoint = function (x, y, pointOperation) {
    if (document.getElementsByClassName('calculatedPoints').length === 2) {
        document.getElementsByClassName('calculatedPoints')[1].remove();
        document.getElementsByClassName('calculatedPoints')[0].remove();

        document.getElementsByClassName('linesConnecting')[1].remove();
        document.getElementsByClassName('linesConnecting')[0].remove();
    }
    const svgNS = 'http://www.w3.org/2000/svg';

    const arrayIntersectInverted = [y, -y];

    for (let i = 0; i < arrayIntersectInverted.length; i++) {
        const circle = document.createElementNS(svgNS, 'circle');
        (i === 0) ? (circle.setAttribute('fill', 'dodgerblue')) : (circle.setAttribute('fill', 'fuchsia'));

        circle.setAttribute('cx', (x * this.scaleX) + this.centerX);
        circle.setAttribute('cy', (-arrayIntersectInverted[i] * this.scaleY) + this.centerY);
        circle.classList.add('calculatedPoints');
        circle.setAttribute('r', 5);

        const svg = document.querySelector('svg');
        svg.appendChild(circle);

        if (i === 0) {
            myGraph.drawLine('+', 'fuchsia', i, x, y, svg, pointOperation);
        } else {
            myGraph.drawLine('-', 'dodgerblue', i, x, y, svg, pointOperation);
        }
    }
};

function logicPointAddition(x) {
    const pointDecider = myGraph.getPointPlacement(x);
    let fromPoint = 0;
    if (pointDecider === 1) {
        const tempPoint = document.getElementsByClassName('workingPoints');

        if (tempPoint[0].getAttribute('cx') > tempPoint[1].getAttribute('cx')) {
            fromPoint = tempPoint[1];
        } else {
            fromPoint = tempPoint[0];
        }
    } else if (pointDecider === 2) {
        fromPoint = document.getElementsByClassName('workingPoints')[0];
    } else if (pointDecider === 3) {
        const tempPoint = document.getElementsByClassName('workingPoints');

        if (tempPoint[0].getAttribute('cx') > tempPoint[1].getAttribute('cx')) {
            fromPoint = tempPoint[0];
        } else {
            fromPoint = tempPoint[1];
        }
    }
    return fromPoint;
}

Graph.prototype.drawLine = function (operator, color, i, x, y, svg, pointOperation) {
    let fromPoint;
    let pointDecider = 0;
    if (pointOperation === 1) {
        fromPoint = logicPointAddition(x);
        pointDecider = myGraph.getPointPlacement(x);
    } else if (pointOperation === 2) {
        fromPoint = document.getElementsByClassName('workingPoints')[0];
    }
    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    if (i === 0) {
        newLine.setAttribute('x1', fromPoint.getAttribute('cx'));
        newLine.setAttribute('y1', fromPoint.getAttribute('cy'));
    } else {
        newLine.setAttribute('x1', (x * this.scaleX) + this.centerX);
        newLine.setAttribute('y1', (-y * this.scaleY) + this.centerY);
    }
    if (pointOperation === 1 && i === 0 && pointDecider === 2) {
        const secondPoint = document.getElementsByClassName('workingPoints')[1];
        newLine.setAttribute('x2', secondPoint.getAttribute('cx'));
        newLine.setAttribute('y2', secondPoint.getAttribute('cy'));
    } else {
        newLine.setAttribute('x2', (x * this.scaleX) + this.centerX);
        newLine.setAttribute('y2', ((((operator === '-') ? (y) : (y)) * this.scaleY) + this.centerY));
    }
    newLine.classList.add('linesConnecting');
    newLine.setAttribute('stroke', color);
    newLine.setAttribute('stroke-width', '2');
    svg.appendChild(newLine);
};

Graph.prototype.addPointOnClick = function () {
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
};
