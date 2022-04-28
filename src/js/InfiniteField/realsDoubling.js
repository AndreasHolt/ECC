import {
    graphToCoords, addCalculatedPoint, getXY, checkExplanationDisplay,
} from './graphHelpers';
import { twoDecimalRound, listPoints } from './realsAddition';

function calculateDouble(myGraph, point) {
    const lambda = (3 * point.x * point.x + myGraph.parameterA) / (2 * point.y);
    const newX = lambda * lambda - 2 * point.x;
    const newY = -point.y + lambda * (point.x - newX);

    return { x: newX, y: newY };
}

function pointDoublingSteps(myGraph, points, lambdaI, x, y) {
    points.x = twoDecimalRound(points.x);
    points.y = twoDecimalRound(points.y);

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
    checkExplanationDisplay();
}

function pointDouble(myGraph) {
    const point = document.getElementsByClassName('workingPoints')[0];
    const storePoint = getXY(point);
    const coords = graphToCoords(myGraph, storePoint);
    coords.y = -coords.y;

    const double = calculateDouble(myGraph, coords);

    const lambda = (3 * double.x * double.x + myGraph.parameterA) / (2 * double.y);

    const listedPoints = listPoints(myGraph, [storePoint], double.x, double.y, 'doubling');
    pointDoublingSteps(myGraph, listedPoints, lambda, double.x, double.y);

    addCalculatedPoint(myGraph, double, 2);
}

export { pointDouble, calculateDouble };
