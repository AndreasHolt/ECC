import { graphToCoords, addCalculatedPoint, getXY } from './graphHelpers';
import { pointDouble } from './realsDoubling';

function twoDecimalRound(val) {
    return Math.round(val * 100) / 100;
}

function listPoints(myGraph, point1, point2, calculatedX, calculatedY, operation) {
    const pObj = graphToCoords(myGraph, point1);
    const P = `${twoDecimalRound(pObj.x)}, ${twoDecimalRound(-pObj.y)}`;

    let Q;
    let qObj;
    if (operation === 'addition') {
        qObj = graphToCoords(myGraph, point2);
        Q = `${twoDecimalRound(qObj.x)}, ${twoDecimalRound(-qObj.y)}`;
    }

    const minusR = `${twoDecimalRound(calculatedX)}, ${twoDecimalRound(-calculatedY)}`;
    const R = `${twoDecimalRound(calculatedX)}, ${twoDecimalRound(calculatedY)}`;

    const pointsListed = document.getElementById('pointsListed');

    if (operation === 'addition') {
        const pqObjArr = [pObj, qObj];
        pointsListed.innerHTML = `\\(P = (${P})\\) &nbsp \\(Q = (${Q})\\) &nbsp \\(-R = (${minusR})\\) &nbsp \\(R = (${R})\\)`;
        // eslint-disable-next-line no-undef
        MathJax.typeset();
        return pqObjArr;
    }
    pointsListed.innerHTML = `\\(P = (${P})\\) &nbsp \\(-R = (${minusR})\\) &nbsp \\(R = (${R})\\)`;
    // eslint-disable-next-line no-undef
    MathJax.typeset();
    return pObj;
}

function pointAdditionSteps(myGraph, points, lambdaI, x, y) {
    points.forEach((point) => {
        // eslint-disable-next-line no-param-reassign
        point.x = twoDecimalRound(point.x);
        // eslint-disable-next-line no-param-reassign
        point.y = twoDecimalRound(point.y);
    });

    // If so we should use Number.toFixed
    const lambda = twoDecimalRound(lambdaI);
    const newX = twoDecimalRound(x);
    const newY = twoDecimalRound(y);

    const stepRows = document.getElementsByClassName('steps');
    stepRows[0].innerHTML = `If P and Q are distinct \\((x_P \\neq x_Q)\\), the line through them has slope: <br>
                            \\(m = \\frac{y_P - y_Q}{x_P - x_Q} = \\frac{${points[0].y} - ${points[1].y}}{${points[0].x} - ${points[1].x}} = \\underline{${lambda}}\\)`;

    stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a third point \\(R = (x_R, y_R):\\) <br>
                            \\(x_R = m^2 - x_P - x_Q = ${lambda}^2 - ${points[0].x} - ${points[1].x} = \\underline{${newX}}\\) <br>
                            \\(y_R = y_P + m(x_R - x_P) = ${points[0].y} + ${lambda}(${newX} - ${points[0].x}) = \\underline{${newY}}\\) <br> <br>
                            \\(\\textbf{R = (${newX}, ${newY})}\\)`;

    // eslint-disable-next-line no-undef
    MathJax.typeset();

    addCalculatedPoint(myGraph, newX, newY, 1);
}

function calculateAddition(myGraph, point1, point2) {
    const lambda = ((point2[1] - point1[1]) / (point2[0] - point1[0]));
    let newX = (lambda * lambda) - point2[0] - point1[0];
    let newY = 0;
    let result = 0;

    // Handle edge case: same x coordinate for both points, but not same y coordinate
    if (point2[0] === point1[0] && point1[1] !== point2[1]) {
        newY = 9999999; // TODO find javascript value for this
        newX = point1[0];
        result = [newX, newY];
        return result;
    } if (point2[0] === point1[0] && point1[1] === point2[1]) {
        pointDouble(myGraph); // Handle edge case: both points are the same, so double the point

        // TODO: pointDoublingSteps when implemented
    } else {
        newY = point2[1] + lambda * newX + lambda * (-point2[0]);
        result = [newX, newY];
        return result;
    }

    return 0;
}

function pointAddition(myGraph) {
    const points = document.getElementsByClassName('workingPoints');

    const point1 = getXY(points[0]);
    const point2 = getXY(points[1]);

    // graphToCoords(myGraph, graphX, graphY)
    // const p1 = graphToCoords(myGraph, )
    const x1 = (point1.x - myGraph.centerX) / myGraph.scaleX;
    const y1 = (point1.y - myGraph.centerY) / myGraph.scaleY;
    const x2 = (point2.x - myGraph.centerX) / myGraph.scaleX;
    const y2 = (point2.y - myGraph.centerY) / myGraph.scaleY;

    const lambda = ((y2 - y1) / (x2 - x1));
    const point1Arr = [x1, y1];
    const point2Arr = [x2, y2];

    const thirdPoint = calculateAddition(myGraph, point1Arr, point2Arr);

    const listedPoints = listPoints(myGraph, point1, point2, thirdPoint[0], thirdPoint[1], 'addition');
    pointAdditionSteps(myGraph, listedPoints, lambda, thirdPoint[0], thirdPoint[1]);

    addCalculatedPoint(myGraph, thirdPoint[0], thirdPoint[1], 1);
}

export {
    pointAddition, listPoints, pointAdditionSteps, calculateAddition,
};
