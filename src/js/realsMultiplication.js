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
    const point = [(points[0].getAttribute('cx') - myGraph.centerX) / myGraph.scaleX, -(points[0].getAttribute('cy') - myGraph.centerY) / myGraph.scaleY];

    const scalar = 4;
    const binary = convertToBinary(scalar); // the array of bits, from msb to lsb

    console.log(binary);
    console.log('This is the point: ', point, 'This is the scalar: ', scalar);

    let i = binary.length - 2;
    let res = point;

    while (i >= 0) { // traversing from most significant bit to least significant bit
        res = calculateDouble(myGraph, res); // double

        if (binary[i] == 1) {
            res = calculateAddition(myGraph, res, point); // addition
        }

        i -= 1;
    }

    addCalculatedPoint(myGraph, res[0], -res[1], 2);

    res[1] = -res[1];
    console.log(res);
    return res;
}

export { pointMultiplication };
