import {
    graphToCoords, addCalculatedPoint, getXY, checkExplanationDisplay,
} from './graphHelpers';
import { pointDouble } from './realsDoubling';

function twoDecimalRound(val) {
    return Math.round(val * 100) / 100;
}

function listPoints(rGraph, placedPoints, calculatedX, calculatedY, operation) {
    const pObj = graphToCoords(rGraph, placedPoints[0]);
    const P = `${twoDecimalRound(pObj.x)}, ${twoDecimalRound(-pObj.y)}`;

    let Q;
    let qObj;
    if (operation === 'addition') {
        qObj = graphToCoords(rGraph, placedPoints[1]);
        Q = `${twoDecimalRound(qObj.x)}, ${twoDecimalRound(-qObj.y)}`;
    }

    const minusR = `${twoDecimalRound(calculatedX)}, ${twoDecimalRound(-calculatedY)}`;
    const R = `${twoDecimalRound(calculatedX)}, ${twoDecimalRound(calculatedY)}`;

    const pointsListed = document.getElementById('pointsListed');

    if (operation === 'addition') {
        const pqObjArr = [pObj, qObj];
        pointsListed.innerHTML = `\\(P = (${P})\\) , &nbsp \\(Q = (${Q})\\) , &nbsp \\(-R = (${minusR})\\) , &nbsp \\(R = (${R})\\)`;
        // eslint-disable-next-line no-undef
        MathJax.typeset();
        return pqObjArr;
    }
    pointsListed.innerHTML = `\\(P = (${P})\\) , &nbsp \\(-R = (${minusR})\\) , &nbsp \\(R = (${R})\\)`;
    // eslint-disable-next-line no-undef

    return pObj;
}

function pointAdditionSteps(rGraph, points, lambdaI, x, y) {
    points.forEach((point) => {
        // eslint-disable-next-line no-param-reassign
        point.x = twoDecimalRound(point.x);
        // eslint-disable-next-line no-param-reassign
        point.y = twoDecimalRound(point.y);
    });

    const lambda = twoDecimalRound(lambdaI);
    const newX = twoDecimalRound(x);
    const newY = twoDecimalRound(y);

    const stepRows = document.getElementsByClassName('steps');
    stepRows[0].innerHTML = `As P and Q are distinct \\((x_P \\neq x_Q)\\), the line through them has slope: <br>
                            \\(m = \\frac{y_P - y_Q}{x_P - x_Q} = \\frac{${points[0].y} - ${points[1].y}}{${points[0].x} - ${points[1].x}} = \\underline{${lambda}}\\)`;

    stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a third point -\\(R = (x_R, y_{-R})\\), the negation of \\(R = (x_R, y_R)\\), where: <br>
                            \\(x_R = m^2 - x_P - x_Q = ${lambda}^2 - ${points[0].x} - ${points[1].x} = \\underline{${newX}}\\) <br>
                            \\(y_R = y_P + m(x_R - x_P) = ${points[0].y} + ${lambda}(${newX} - ${points[0].x}) = \\underline{${newY}}\\) <br> Hence:  <br>
                            \\(\\textbf{R = (${newX}, ${newY})}\\) and <br>
                            \\(\\textbf{-R = (${newX}, ${-newY})}\\).`;

    // eslint-disable-next-line no-undef
    checkExplanationDisplay();

    addCalculatedPoint(rGraph, { x: newX, y: newY }, 1);
}

function calculateAddition(rGraph, pointArr) {
    const point = {};

    if (pointArr[0] === 0) {
        return pointArr[1];
    }

    // Handle edge case: point doubling if P = Q
    if (pointArr[1].x === pointArr[0].x && pointArr[0].y === pointArr[1].y) {
        pointDouble(rGraph);
        return 0;
    }

    const lambda = ((pointArr[1].y - pointArr[0].y) / (pointArr[1].x - pointArr[0].x));
    point.x = (lambda * lambda) - pointArr[1].x - pointArr[0].x;
    point.y = pointArr[1].y + lambda * point.x + lambda * (-pointArr[1].x);

    // Handle edge case: point at infinity
    if (pointArr[1].x === pointArr[0].x && pointArr[0].y !== pointArr[1].y) {
        point.y = Number.MAX_SAFE_INTEGER;
        point.x = pointArr[0].x;
    }

    return point;
}

function pointAddition(rGraph) {
    const wPoints = document.getElementsByClassName('workingPoints');

    const points = [getXY(wPoints[0]), getXY(wPoints[1])];

    const p1 = graphToCoords(rGraph, points[0]);
    const p2 = graphToCoords(rGraph, points[1]);

    const lambda = ((p2.y - p1.y) / (p2.x - p1.x));

    const thirdPoint = calculateAddition(rGraph, [p1, p2]);

    if (!thirdPoint) { return; }

    const listedPoints = listPoints(rGraph, points, thirdPoint.x, thirdPoint.y, 'addition');

    pointAdditionSteps(rGraph, listedPoints, lambda, thirdPoint.x, thirdPoint.y);

    addCalculatedPoint(rGraph, thirdPoint, 1);
}

export {
    pointAddition, listPoints, pointAdditionSteps, calculateAddition, twoDecimalRound,
};
