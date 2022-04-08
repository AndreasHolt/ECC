import { addCalculatedPoint, getXY, graphToCoords } from './graphHelpers';
import { calculateDouble } from './realsDoubling';
import { calculateAddition } from './realsAddition';

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
    const pointEl = document.getElementsByClassName('workingPoints')[0];
    const point = graphToCoords(myGraph, getXY(pointEl));
    point.y = -point.y;

    const scalar = document.getElementById('scalarForm').value;
    const binary = convertToBinary(scalar); // the array of bits, from msb to lsb

    let i = binary.length - 2;
    let res = point;

    while (i >= 0) { // traversing from most significant bit to least significant bit
        res = calculateDouble(myGraph, res); // double

        // eslint-disable-next-line
        if (binary[i] == 1) {
            res = calculateAddition(myGraph, [res, point]);
        }

        i -= 1;
    }

    addCalculatedPoint(myGraph, res, 3);

    res.y = -res.y;
    return res;
}

export { pointMultiplication };
