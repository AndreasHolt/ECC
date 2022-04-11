import {
    addCalculatedPoint, getXY, graphToCoords, removeBinaryParagraphs,
} from './graphHelpers';
import { calculateDouble } from './realsDoubling';
import { calculateAddition, listPoints, twoDecimalRound } from './realsAddition';

function pointMultiplicationSteps(myGraph, points, x, y, scalar) {
    points.x = twoDecimalRound(points.x);
    points.y = twoDecimalRound(points.y);

    const binary = convertToBinary(scalar, 0);

    // If so we should use Number.toFixed
    const newX = twoDecimalRound(x);
    const newY = twoDecimalRound(y);

    const arrayPowerOfTwo = [];

    // Show binary representation calculations
    for (let i = 0; i < binary.length; i += 1) {
        if (binary[i] === '1') {
            arrayPowerOfTwo.push(`\\(1 \\cdot 2^${i}\\) `);
        } else {
            arrayPowerOfTwo.push(`\\(0 \\cdot 2^${i}\\) `);
        }
    }

    const stepRows = document.getElementsByClassName('steps');

    // TODO Only load LaTeX when eventListener on calculation button is triggered
    // REMOVE FROM HTML when calculation button event listener
    removeBinaryParagraphs();

    const paragraphPowerOfTwo = document.createElement('p');
    paragraphPowerOfTwo.className = 'paragraphBinary';
    stepRows[0].insertAdjacentElement('afterend', paragraphPowerOfTwo);

    // clear inner HTML whenever a new scalar is being input

    document.getElementById('calculatingHeader').innerHTML = 'Point Multiplication: Double and Add Algorithm';
    stepRows[0].innerHTML = `There exist faster algorithms than simply computing \\(n \\cdot P\\), which requires n additions. One of them is the double and add algorithm: <br>
                              Get the binary representation of the scalar \\(${scalar}\\), which is \\(\\textbf{${binary}}\\). This binary representation can be turned into a sum of powers of two: <br>`;

    arrayPowerOfTwo.forEach((number) => stepRows[0].innerHTML += number);

    /*   stepRows[1].innerHTML = `The intersection of this line with the elliptic curve is a new point \\(R = (x_R, y_R):\\) <br>
                               \\(x_R = m^2 - 2x_P = ${lambda}^2 - 2 \\cdot ${points.x}  = \\underline{${newX}}\\) <br>
                               \\(y_R = -y_P + m(x_P - x_R) = -${points.y} + ${lambda}(${points.x} -  ${newX}) = \\underline{${newY}}\\) <br> <br>
                               \\(\\textbf{R = (${newX}, ${newY})}\\)`;
    */
    // eslint-disable-next-line no-undef
    MathJax.typeset();
}

function convertToBinary(scalar, arrayBool) {
    let num = scalar;
    let binary = (num % 2).toString();

    while (num > 1) {
        num = parseInt(num / 2, 10);
        binary = (num % 2) + (binary);
    }

    if (arrayBool !== 1) {
        return binary;
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

    const listedPoints = listPoints(myGraph, [point], res.x, res.y, 'doubling');
    pointMultiplicationSteps(myGraph, listedPoints, res.x, res.y, scalar);

    addCalculatedPoint(myGraph, res, 3);

    res.y = -res.y;
    return res;
}

export { pointMultiplication };
