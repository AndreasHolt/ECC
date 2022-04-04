import { addCalculatedPoint } from './graphHelpers';
import { pointDouble, calculateDouble } from './realsDoubling';
import { pointAddition } from './realsAddition';

function convertToBinary(scalar) {
    let num = scalar;
    let binary = (num % 2).toString();

    while (num > 1) {
        num = parseInt(num / 2, 10);
        binary = (num % 2) + (binary);
    }

    const binaryArray = (`${binary}`).split('');

    return binaryArray;
}

function pointMultiplication(myGraph) {
    const points = document.getElementsByClassName('workingPoints');
    const point = [(points[0].getAttribute('cx') - myGraph.centerX) / myGraph.scaleX, (points[0].getAttribute('cy') - myGraph.centerY) / myGraph.scaleY];

    const binary = convertToBinary(151);
    console.log(binary);

    for (let i = binary.length - 1; i >= 0; i -= 1) {
        let doubledPoint = calculateDouble(myGraph, point);
        pointAddition(myGraph, point, doubledPoint)
    }
}

/*
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

    let newX = (lambda * lambda) - x2 - x1;
    let newY = 0;

    // Handle edge case: same x coordinate for both points (i.e. vertical line), but not same y coordinate
    if (x2 === x1 && y1 !== y2) {
        newY = 9999999;
        newX = x1;
    } else if (x2 === x1 && y1 === y2) {
        pointDouble(myGraph); // Handle edge case: both points are the same, so double the point instead

        // TODO: pointDoublingSteps when implemented
        return;
    } else {
        newY = y2 + lambda * newX + lambda * (-x2);
    }

    pointAdditionSteps(myGraph, listedPoints, lambda, newX, newY);

    addCalculatedPoint(myGraph, newX, newY, 1);
}
*/
export { pointMultiplication };
