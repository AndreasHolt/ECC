import { addCalculatedPoint, graphToCoords } from './graphHelpers';
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
    let res;
    const points = document.getElementsByClassName('workingPoints');
    const point = graphToCoords(myGraph, [points[0].getAttribute('cx'), points[0].getAttribute('cy')]);

    const scalar = 8;
    const binary = convertToBinary(scalar); // the array of bits, from msb to lsb

    let i = binary.length - 2;

    while (i >= 0) { // traversing from most significant bit to least significant bit
        res = calculateDouble(myGraph, point); // double

        if (binary[i] === 1) {
            res = calculateAddition(myGraph, res, point); // addition
        }

        i -= 1;
    }

    addCalculatedPoint(myGraph, res.x, -res.y, 2);

    res.y = -res.y;
    return res;
}

export { pointMultiplication };
