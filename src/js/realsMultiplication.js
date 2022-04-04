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

    const binaryArray = (`${binary}`).split('');

    return binaryArray;
}

function pointMultiplication(myGraph) {
    const points = document.getElementsByClassName('workingPoints');
    let point = [(points[0].getAttribute('cx') - myGraph.centerX) / myGraph.scaleX, -(points[0].getAttribute('cy') - myGraph.centerY) / myGraph.scaleY];

    const scalar = 3;
    const binary = convertToBinary(scalar);
    
    console.log(binary)
    console.log('This is the point: ', point, 'This is the scalar: ', scalar);


    let Q = [0, 0];
    let R = point;
    for (let i = 0; i < binary.length; i += 1) {
        if (Number(binary[i]) === 1) {
            console.log('adding');
            let tempQ = Q;
            Q = calculateAddition(myGraph, tempQ, R);
        }
        let tempR = R;
        R = calculateDouble(myGraph, tempR);
        console.log('doubling');
    }
    
    addCalculatedPoint(myGraph, R[0], R[1], 2);



    console.log(R)
    return R;
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
