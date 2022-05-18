import {
    addCalculatedPoint, getXY, graphToCoords, removeBinaryParagraphs, checkExplanationDisplay,
} from './graphHelpers';
import { calculateDouble } from './realsDoubling';
import { calculateAddition, listPoints, twoDecimalRound } from './realsAddition';

function pointMultiplicationSteps(myGraph, points, x, y, scalar) {
    points.x = twoDecimalRound(points.x);
    points.y = twoDecimalRound(points.y);

    const binary = convertToBinary(scalar, 0);

    const arrayPowerOfTwo = [];
    const arrayPowerOfTwoOnes = [];

    // Show binary representation calculations
    for (let i = 0; i < binary.length; i += 1) {
        if (binary[i] === '1') {
            arrayPowerOfTwo.push(`\\(1 \\cdot 2^{${binary.length - 1 - i}}\\) `);
            arrayPowerOfTwoOnes.push(`\\(2^{${binary.length - 1 - i}}\\)`);
        } else {
            arrayPowerOfTwo.push(`\\(0 \\cdot 2^{${binary.length - 1 - i}}\\) `);
        }
    }

    const stepRows = document.getElementsByClassName('steps');
    stepRows[1].innerHTML = '';

    removeBinaryParagraphs();

    const paragraphPowerOfTwo = document.createElement('p');
    paragraphPowerOfTwo.className = 'paragraphBinary';
    stepRows[0].insertAdjacentElement('afterend', paragraphPowerOfTwo);

    // clear inner HTML whenever a new scalar is being input

    document.getElementById('calculatingHeader').innerHTML = 'Point Multiplication: Double and Add Algorithm';
    stepRows[0].innerHTML = `There exist faster algorithms than simply computing \\(n \\cdot P\\), which requires \\(n - 1\\) additions. One of them is the double and add algorithm: <br>
                              Get the binary representation of the scalar \\(${scalar}\\), which is \\(\\textbf{${binary}}\\). This binary representation can be turned into a sum of powers of two: <br>
                              \\(${scalar} = \\) &nbsp`;

    for (let i = 0; i < arrayPowerOfTwo.length; i += 1) {
        stepRows[0].innerHTML += arrayPowerOfTwo[i];
        if (i !== arrayPowerOfTwo.length - 1) {
            stepRows[0].innerHTML += ' + ';
        }
    }

    stepRows[0].innerHTML += `<br> <br> Which we can write as: <br>
                              \\(${scalar} \\cdot P = \\) &nbsp`;

    for (let i = 0; i < arrayPowerOfTwoOnes.length; i += 1) {
        stepRows[0].innerHTML += `${arrayPowerOfTwoOnes[i]}\\(P\\)`;
        if (i !== arrayPowerOfTwoOnes.length - 1) {
            stepRows[0].innerHTML += ' + ';
        }
    }

    stepRows[1].innerHTML += '<br> Therefore the Double and Add algorithm tells us to: <br> <br>• Take \\(P\\) <br>';

    for (let i = 0; i < binary.length; i += 1) {
        if (i !== 0) {
            stepRows[1].innerHTML += `• Double \\( 2^{${i - 1}}P\\), so that we get \\(2^{${i}}P\\) <br>`;
            if (binary[binary.length - 1 - i] === '1') {
                stepRows[1].innerHTML += `• Add \\(2^{${i}}P\\) to our result <br>`;
            } else {
                stepRows[1].innerHTML += `• Don't perform any addition involving \\(2^{${i}}P\\) <br>`;
            }
        }
    }

    const numAdditions = (scalar % 2 === 0) ? (arrayPowerOfTwoOnes.length) : (arrayPowerOfTwoOnes.length - 1);

    stepRows[1].innerHTML += `<br>Thus, to compute \\(${scalar} \\cdot P \\), we only have to perform ${numAdditions} additions and ${binary.length - 1} doublings.`;

    // eslint-disable-next-line no-undef
    checkExplanationDisplay();
}

function convertToBinary(scalar, arrayBool) {
    let num = scalar;
    let binary = (num % 2).toString();

    while (num > 1) {
        num = parseInt(num / 2);
        binary = (num % 2) + (binary);
    }

    if (arrayBool !== 1) {
        return binary;
    }

    const binaryArray = (`${binary}`).split('').reverse();

    return binaryArray;
}

function pointMultiplication(myGraph, changedScalar = false) {
    const pointEl = document.getElementsByClassName('workingPoints')[0];
    const point = graphToCoords(myGraph, getXY(pointEl));
    point.y = -point.y;

    if (changedScalar) {
        const els = document.getElementsByClassName('pointR');

        Array.from(els).forEach((el) => {
            el.remove();
        });
    }

    const scalar = document.getElementById('scalarForm').value;
    const binary = convertToBinary(scalar, 1); // the array of bits, from msb to lsb

    const Q = 0;

    const bits = binary;
    let i = bits.length - 2;
    let res = point;

    while (i >= 0) {
        res = calculateDouble(myGraph, res); // Double
        if (bits[i] == 1) {
            res = calculateAddition(myGraph, [res, point]); // Add
            res.y = -res.y;
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
