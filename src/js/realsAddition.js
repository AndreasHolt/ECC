import { graphToCoords, addCalculatedPoint } from './graphHelpers';

function listPoints(myGraph, placedPoints, calculatedX, calculatedY, operation) {
    const pObj = graphToCoords(myGraph, placedPoints.point1[0], placedPoints.point1[1]);
    const P = `${Math.round(pObj.x * 100) / 100}, ${Math.round(-pObj.y * 100) / 100}`;

    let Q;
    let qObj;
    if (operation === 'addition') {
        qObj = graphToCoords(myGraph, placedPoints.point2[0], placedPoints.point2[1]);
        Q = `${Math.round(qObj.x * 100) / 100}, ${Math.round(-qObj.y * 100) / 100}`;
    }

    const minusR = `${Math.round(calculatedX * 100) / 100}, ${Math.round(-calculatedY * 100) / 100}`;
    const R = `${Math.round(calculatedX * 100) / 100}, ${Math.round(calculatedY * 100) / 100}`;

    const pointsListed = document.getElementById('pointsListed');

    if (operation === 'addition') {
        const pqObjArr = [pObj, qObj];
        pointsListed.innerHTML = `\\(P = (${P})\\) &nbsp \\(Q = (${Q})\\) &nbsp \\(-R = (${minusR})\\) &nbsp \\(R = (${R})\\)`;
        MathJax.typeset();
        return pqObjArr;
    }
    pointsListed.innerHTML = `\\(P = (${P})\\) &nbsp \\(-R = (${minusR})\\) &nbsp \\(R = (${R})\\)`;
    MathJax.typeset();
    return pObj;
}

function pointAdditionSteps(points, lambda, newX, newY) {
    points.forEach((point) => {
        point.x = Math.round(point.x * 100) / 100;
        point.y = Math.round(point.y * 100) / 100;
    });

    lambda = Math.round(lambda * 100) / 100;
    newX = Math.round(newX * 100) / 100;
    newY = Math.round(newY * 100) / 100;

    const stepRows = document.getElementsByClassName('steps');
    stepRows[0].innerHTML = `If P and Q are distinct \\((x_P \\neq x_Q)\\), the line through them has slope: <br>
                            \\(m = \\frac{y_P - y_Q}{x_P - x_Q} = \\frac{${points[0].y} - ${points[1].y}}{${points[0].x} - ${points[1].x}} = \\underline{${lambda}}\\)`;

    stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a third point \\(R = (x_R, y_R):\\) <br>
                            \\(x_R = m^2 - x_P - x_Q = ${lambda}^2 - ${points[0].x} - ${points[1].x} = \\underline{${newX}}\\) <br>
                            \\(y_R = y_P + m(x_R - x_P) = ${points[0].y} + ${lambda}(${newX} - ${points[0].x}) = \\underline{${newY}}\\) <br> <br>
                            \\(\\textbf{R = (${newX}, ${newY})}\\)`;

    MathJax.typeset();
}

function pointAddition(myGraph) {
    const points = document.getElementsByClassName('workingPoints');

    const storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
        point2: [points[1].getAttribute('cx'), points[1].getAttribute('cy')],
    };
    const x1 = (storePoints.point1[0] - myGraph.centerX) / myGraph.scaleX; const
        y1 = (storePoints.point1[1] - myGraph.centerY) / myGraph.scaleY;
    const x2 = (storePoints.point2[0] - myGraph.centerX) / myGraph.scaleX; const
        y2 = (storePoints.point2[1] - myGraph.centerY) / myGraph.scaleY;

    const lambda = ((y2 - y1) / (x2 - x1));
    const newX = (lambda * lambda) - x2 - x1;
    const newY = y2 + lambda * newX + lambda * (-x2);

    const listedPoints = listPoints(myGraph, storePoints, newX, newY, 'addition');
    pointAdditionSteps(listedPoints, lambda, newX, newY);

    addCalculatedPoint(newX, newY, 1, myGraph);
}

export { pointAddition, listPoints, pointAdditionSteps };
