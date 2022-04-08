import { graphToCoords, addCalculatedPoint, getXY } from './graphHelpers';
import { pointDouble } from './realsDoubling';

function twoDecimalRound(val) {
    return Math.round(val * 100) / 100;
}

function listPoints(myGraph, placedPoints, calculatedX, calculatedY, operation) {
    const pObj = graphToCoords(myGraph, placedPoints[0]);
    const P = `${twoDecimalRound(pObj.x)}, ${twoDecimalRound(-pObj.y)}`;

    let Q;
    let qObj;
    if (operation === 'addition') {
        qObj = graphToCoords(myGraph, placedPoints[1]);
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
        pointDouble(myGraph); // TODO Handle edge case: both points are the same, so double the point

        // TODO: pointDoublingSteps when implemented
    } else {
        newY = point2[1] + lambda * newX + lambda * (-point2[0]);
        result = [newX, newY];
        return result;
    }

    return 0;
}

function pointAddition(myGraph) {
    const wPoints = document.getElementsByClassName('workingPoints');

    const points = [getXY(wPoints[0]), getXY(wPoints[1])];

    const p1 = graphToCoords(myGraph, points[0]);
    const p2 = graphToCoords(myGraph, points[1]);

    const lambda = ((p2.y - p1.y) / (p2.x - p1.x));
    const point1Arr = [p1.x, p1.y];
    console.log([p1.x, p1.y], p1);
    const point2Arr = [p2.x, p2.y];

    const thirdPoint = calculateAddition(myGraph, point1Arr, point2Arr);

    const listedPoints = listPoints(myGraph, points, thirdPoint[0], thirdPoint[1], 'addition');
    pointAdditionSteps(myGraph, listedPoints, lambda, thirdPoint[0], thirdPoint[1]);

    addCalculatedPoint(myGraph, thirdPoint[0], thirdPoint[1], 1);
}

export {
    pointAddition, listPoints, pointAdditionSteps, calculateAddition, twoDecimalRound,
};
