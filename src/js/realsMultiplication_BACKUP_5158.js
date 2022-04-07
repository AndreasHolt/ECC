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
    const point = [(points[0].getAttribute('cx') - myGraph.centerX) / myGraph.scaleX, -(points[0].getAttribute('cy') - myGraph.centerY) / myGraph.scaleY];

    const scalar = document.getElementById('scalarForm').value;
    const binary = convertToBinary(scalar); // the array of bits, from msb to lsb

    let i = binary.length - 2;
    let res = point;

    while (i >= 0) { // traversing from most significant bit to least significant bit
        res = calculateDouble(myGraph, res); // double

        if (binary[i] == 1) {
            res = calculateAddition(myGraph, res, point); // addition
        }

        i -= 1;
    }
<<<<<<< HEAD
    
    console.log('Calculated points: ', res[0], -res[1])
    addCalculatedPoint(myGraph, res[0], res[1], 3);

=======
>>>>>>> 12d400c7f844850f7a3318619cb6ec787f0b45b1

    addCalculatedPoint(myGraph, res[0], -res[1], 2);

    res[1] = -res[1];
    return res;
}

export { pointMultiplication };
