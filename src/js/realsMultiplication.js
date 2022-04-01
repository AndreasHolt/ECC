import { addCalculatedPoint } from './graphHelpers';
import { pointDouble } from './realsDoubling';
import { pointAddition } from './realsAddition';




function pointMultiplication(myGraph) {
    console.log('tes')
    const points = document.getElementsByClassName('workingPoints');
    const storePoints = {
        point1: [points[0].getAttribute('cx'), points[0].getAttribute('cy')],
    };

    const x = (storePoints.point1[0] - myGraph.centerX) / myGraph.scaleX;
    const y = -(storePoints.point1[1] - myGraph.centerY) / myGraph.scaleY;

    const lambda = (3 * x * x + myGraph.parameterA) / (2 * y);
    const newX = lambda * lambda - 2 * x;

    sumOfPowers(151)

}



function sumOfPowers(scalar) {

    let binary = convertToBinary(scalar)
    let raisedToPower = binary.length -1

}

function convertToBinary(scalar) {
    let num = scalar;
    let binary = (num % 2).toString();
    for (; num > 1; ) {
        num = parseInt(num / 2);
        binary =  (num % 2) + (binary);
    }
    console.log(binary);
    return binary
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

