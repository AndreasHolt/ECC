import { addCalculatedPoint } from './graphHelpers';
import { pointDouble, calculateDouble } from './realsDoubling';
import { pointAddition, calculateAddition } from './realsAddition';

function convertToBinary(scalar) {
    let num = scalar;
    let binary = (num % 2).toString();

    while (num > 1) {
        num = parseInt(num / 2, 10);
        binary = (num % 2) + (binary);
    }

    const binaryArray = (`${binary}`).split('').reverse();

    return binaryArray;
}

function pointMultiplication(myGraph) {
    const points = document.getElementsByClassName('workingPoints');
    let point = [(points[0].getAttribute('cx') - myGraph.centerX) / myGraph.scaleX, -(points[0].getAttribute('cy') - myGraph.centerY) / myGraph.scaleY];

    const scalar = document.getElementById('scalarForm').value;
    const binary = convertToBinary(scalar); // the array of bits, from msb to lsb
    
    console.log(binary)
    console.log('This is the point: ', point, 'This is the scalar: ', scalar);

    let i = binary.length - 2;
    let res = point;

    while (i >= 0) { // traversing from most significant bit to least significant bit
        res = calculateDouble(myGraph, res) // double
        
        if (binary[i] == 1) {
            res = calculateAddition(myGraph, res, point) // addition
        }

        i = i - 1

    }
    
    console.log('Calculated points: ', res[0], -res[1])
    addCalculatedPoint(myGraph, res[0], res[1], 3);



    res[1] = -res[1]
    console.log(res)
    return res;
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
