import { graphToCoords, addCalculatedPoint, getXY } from './graphHelpers';
import { twoDecimalRound, listPoints } from './realsAddition';

function calculateDouble(myGraph, point) {
    const newPointArr = [];

    const lambda = (3 * point[0] * point[0] + myGraph.parameterA) / (2 * point[1]);
    const newX = lambda * lambda - 2 * point[0];
    const newY = -point[1] + lambda * (point[0] - newX);

    newPointArr[0] = newX;
    newPointArr[1] = newY;

    return newPointArr;
}

function pointDoublingSteps(myGraph, points, lambdaI, x, y) {
    points.x = twoDecimalRound(points.x);
    points.y = twoDecimalRound(points.y);

    // If so we should use Number.toFixed
    const lambda = twoDecimalRound(lambdaI);
    const newX = twoDecimalRound(x);
    const newY = twoDecimalRound(y);

    const stepRows = document.getElementsByClassName('steps');
    stepRows[0].innerHTML = `If P and Q are distinct \\((x_P \\neq x_Q)\\), the line through them has slope: <br>
                            \\(m =  \\frac{3 \\cdot x_P^2 + a}{2 \\cdot y_P} = \\frac{3 \\cdot ${points.x}^2 + ${myGraph.parameterA}}{2 \\cdot ${points.y}} = \\underline{${lambda}}\\)`;

    stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a new point \\(R = (x_R, y_R):\\) <br>
                            \\(x_R = m^2 - 2x_P = ${lambda}^2 - 2 \\cdot ${points.x}  = \\underline{${newX}}\\) <br>
                            \\(y_R = -y_P + m(x_P - x_R) = -${points.y} + ${lambda}(${points.x} -  ${newX}) = \\underline{${newY}}\\) <br> <br>
                            \\(\\textbf{R = (${newX}, ${newY})}\\)`;

    // eslint-disable-next-line no-undef
    MathJax.typeset();
}

function pointDouble(myGraph) {
    const pointArr = [];
    let newPointArr = [];

    const point = document.getElementsByClassName('workingPoints')[0];
    const storePoint = [getXY(point)];

    pointArr[0] = (storePoint[0].x - myGraph.centerX) / myGraph.scaleX;
    pointArr[1] = -(storePoint[0].y - myGraph.centerY) / myGraph.scaleY;

    newPointArr = calculateDouble(myGraph, pointArr);

    const lambda = (3 * newPointArr[0] * newPointArr[0] + myGraph.parameterA) / (2 * newPointArr[1]);

    const listedPoints = listPoints(myGraph, storePoint, newPointArr[0], newPointArr[1], 'doubling');
    pointDoublingSteps(myGraph, listedPoints, lambda, newPointArr[0], newPointArr[1]);

    addCalculatedPoint(myGraph, newPointArr[0], newPointArr[1], 2);
}



export { pointDouble, calculateDouble };
